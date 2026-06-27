# GPU 显存 vs 模型大小速查

跑模型之前先搞清楚你需要多少显存。显存不够，模型就加载不进去，或者只能跑量化版本。

关于 FP16、BF16、INT4 等精度概念的详细说明，见 [模型精度与量化](/reference/precision-quantization)。

## 显存占用组成

模型实际占用的显存不只是权重本身：

```text
模型权重（固定）
+ KV cache（随 context 长度和 batch 增长）
+ 激活值 / workspace
+ CUDA 内部开销（fragmentation）
= 总显存
```

- **模型权重**：加载后基本不变，是最低显存需求
- **KV cache**：推理时动态分配，context 越长、batch 越大，占用越多
- **激活值**：前向传播的中间结果，训练时比推理时大得多
- **CUDA fragmentation**：显存分配器的碎片，通常占 5%-15%

## FP16/BF16 模型显存估算

粗略公式：参数量 × 2（字节）= 权重显存。但推荐显存要留出 KV cache 和其他开销的空间。

| 模型 | FP16 权重 | 推荐显存 | 能跑的 GPU |
|---|---|---|---|
| Qwen2.5-0.5B | ~1 GB | 4 GB+ | GTX 1650、RTX 3050 |
| Qwen2.5-1.5B | ~3 GB | 8 GB+ | RTX 3060、RTX 4060 |
| Qwen2.5-3B | ~6 GB | 12 GB+ | RTX 3060 12GB、RTX 4070 |
| Qwen2.5-7B | ~14 GB | 24 GB+ | RTX 3090、RTX 4090、A10 |
| Llama-3.1-8B | ~16 GB | 24 GB+ | RTX 3090、RTX 4090、A10 |
| Qwen2.5-14B | ~28 GB | 48 GB+ | A100 80GB、多卡 |
| Llama-3.1-70B | ~140 GB | 多卡 TP=4/8 | A100 集群 |

**注意**：推理时 KV cache 会额外占用显存。7B 模型在 4096 context 长度下，KV cache 可能额外占用 2-4 GB。

## 量化后显存

量化是用精度换显存的权衡：

| 精度 | 每参数字节 | 7B 模型显存 | 质量损失 |
|---|---|---|---|
| FP32 | 4 | ~28 GB | 无 |
| FP16/BF16 | 2 | ~14 GB | 几乎无 |
| INT8 | 1 | ~7 GB | 轻微，可接受 |
| INT4 (GPTQ/AWQ) | 0.5 | ~3.5 GB | 明显，但可用 |

### 量化选择建议

- **聊天/问答**：INT4 足够，速度优先
- **代码生成**：INT8 更稳，减少幻觉
- **长文生成**：FP16 更安全，避免累积误差
- **训练/微调**：必须 FP16/BF16，不能用 INT8/INT4

## 常见 GPU 显存速查

| GPU | 显存 | 能跑的最大模型（FP16） | 能跑的最大模型（INT4） |
|---|---|---|---|
| RTX 3060 | 12 GB | 7B | 14B |
| RTX 3090 | 24 GB | 14B | 70B（勉强） |
| RTX 4090 | 24 GB | 14B | 70B（勉强） |
| A10 | 24 GB | 14B | 70B |
| A100 40GB | 40 GB | 30B | 70B+ |
| A100 80GB | 80 GB | 70B | 70B+ |

## vLLM / SGLang 的显存控制

当你用 vLLM 或 SGLang 部署模型时，框架不会把所有显存都给模型权重，而是会预留一部分给 KV cache（用于存储对话历史）。你可以通过参数控制这个比例。

- **vLLM**：`gpu_memory_utilization` 参数控制 KV cache 占可用显存的比例（默认 0.9）
- **SGLang**：`mem_fraction_static` 控制静态分配比例

```bash
# vLLM：预留更多显存给 KV cache
python -m vllm.entrypoints.openai.api_server --model Qwen/Qwen2.5-7B-Instruct --gpu-memory-utilization 0.95

# SGLang：调整静态分配比例
python -m sglang.launch_server --model Qwen/Qwen2.5-7B-Instruct --mem-fraction-static 0.85
```

## 实际显存查看

```bash
# 查看当前 GPU 显存使用
nvidia-smi

# 代码中查看
python -c "
import torch
print(f'已用: {torch.cuda.memory_allocated()/1024**3:.2f} GB')
print(f'缓存: {torch.cuda.memory_reserved()/1024**3:.2f} GB')
"
```

## 下一步

- [环境与 CUDA 路线](/start/environment) — 配置 PyTorch CUDA 环境
- [Benchmark 与 Profiling](/systems/benchmark-profiling) — 性能分析方法论
- [问题排查指南](/reference/troubleshooting) — CUDA 问题排查
