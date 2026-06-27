# Profiling 工具快速入门

性能分析是找出瓶颈的关键。先用简单的工具定位问题，再用专业工具深入分析。

## 工具层次

```text
nvidia-smi          → 粗看 GPU 利用率和显存（最简单）
torch.profiler      → 看 PyTorch 算子级别的 CPU/CUDA 耗时（最常用）
Nsight Systems      → 看全局 timeline（CPU/GPU 并行、stream、kernel 顺序）
Nsight Compute      → 看单个 kernel 的硬件指标（occupancy、带宽、cache hit）
```

**原则**：从上往下用。先用 nvidia-smi 判断是不是 GPU 问题，再用 torch.profiler 定位具体算子，最后才上 Nsight。

## 第一步：nvidia-smi 实时监控

```bash
# 持续刷新（每秒）
nvidia-smi -l 1

# 只看 GPU 利用率和显存
nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total --format=csv -l 1
```

### 怎么看 nvidia-smi

| 指标 | 正常范围 | 异常说明 |
|---|---|---|
| GPU-Util | 70%-99% | 低于 50% 说明计算没跑满 |
| Memory-Used | 接近总显存 | 接近满可能 OOM |
| Fan | 30%-80% | 长期 100% 可能过热降频 |

**常见问题**：GPU-Util 是 0% 但程序在跑 → 模型可能还在 CPU 上，或者卡在数据加载。

## 第二步：torch.profiler 最小示例

```python
import torch
from torch.profiler import profile, record_function, ProfilerActivity

model = torch.nn.Linear(1024, 1024).cuda()
x = torch.randn(32, 1024).cuda()

with profile(
    activities=[ProfilerActivity.CPU, ProfilerActivity.CUDA],
    record_shapes=True,
) as prof:
    with record_function("matmul"):
        y = model(x)

print(prof.key_averages().table(sort_by="cuda_time_total", row_limit=10))
```

### 输出解读

```
--------------------------  ------------  ------------  ------------  ------------  ------------  ------------
                         Name      CPU time     CUDA time            Calls    CPU total     CUDA total
--------------------------  ------------  ------------  ------------  ------------  ------------  ------------
                   matmul       1.234ms       0.567ms            1       1.234ms       0.567ms
              aten::linear       1.456ms       0.678ms            1       1.456ms       0.678ms
--------------------------  ------------  ------------  ------------  ------------  ------------  ------------
```

| 列 | 含义 |
|---|---|
| CPU time | CPU 端耗时（含 kernel launch） |
| CUDA time | GPU kernel 实际执行时间 |
| Calls | 该算子被调用次数 |
| CUDA Mem Alloc | 显存分配操作 |

### 常用分析模式

```python
# 按 CPU 耗时排序（找 CPU 瓶颈）
print(prof.key_averages().table(sort_by="cpu_time_total", row_limit=10))

# 按 CUDA 耗时排序（找 GPU 瓶颈）
print(prof.key_averages().table(sort_by="cuda_time_total", row_limit=10))

# 导出 Chrome Trace（可视化分析）
prof.export_chrome_trace("trace.json")
# 在 chrome://tracing 中打开 trace.json
```

## 第三步：Nsight Systems（进阶）

当 torch.profiler 不够用时，用 Nsight Systems 看全局 timeline：

```bash
# 安装（Ubuntu）
sudo apt-get install nsight-systems

# 录制
nsys profile -o report python your_script.py

# 查看报告
nsys-ui report.qdrep
```

**适用场景**：
- CPU 和 GPU 的并行情况
- 多 stream 的执行顺序
- 数据加载是否卡住了 GPU

## 第四步：Nsight Compute（内核级）

分析单个 CUDA kernel 的硬件利用率：

```bash
ncu -o kernel_report python your_script.py
```

**适用场景**：
- 为什么某个 kernel 比预期慢
- occupancy、带宽、cache hit rate
- 精确到硬件级别的优化

## 实际案例：找出推理慢的原因

```python
import torch
from torch.profiler import profile, ProfilerActivity

model = torch.nn.TransformerEncoderLayer(d_model=512, nhead=8).cuda()
x = torch.randn(32, 10, 512).cuda()

# 预热（首次推理慢是正常的）
for _ in range(3):
    _ = model(x)

# 正式测量
with profile(activities=[ProfilerActivity.CPU, ProfilerActivity.CUDA]) as prof:
    y = model(x)

print(prof.key_averages().table(sort_by="cuda_time_total", row_limit=5))
```

如果 CUDA time 远小于 CPU time → 问题在 CPU 端（数据加载、预处理）
如果 CUDA time 很长 → 问题在 GPU 端（模型太大、batch 太大）

## 下一步

- [Benchmark 与 Profiling](/systems/benchmark-profiling) — 完整的性能分析方法论
- [GPU 显存速查](/reference/gpu-memory) — 模型显存需求参考
- [问题排查指南](/reference/troubleshooting) — CUDA 问题排查
