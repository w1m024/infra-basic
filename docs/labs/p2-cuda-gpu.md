# CUDA GPU 编程入门指南

本文档把 `infra-basic` 的底层编程路线明确为 **CUDA-first / NVIDIA 标准环境**。也就是说，后续学习、实验、benchmark 和源码阅读默认使用：

```text
Linux
→ NVIDIA GPU
→ NVIDIA Driver
→ CUDA Toolkit
→ PyTorch CUDA
→ Triton CUDA
→ vLLM / SGLang CUDA path
```

其他硬件后端可以作为扩展方向，但不作为本仓库主线。

## 1. 是否必须学习 CUDA？

结论：必须理解 CUDA/GPU 编程模型，但不需要在第一个月就深入写复杂 CUDA kernel。

对 LLM 推理基础设施，CUDA 的作用主要是帮助你理解：

- 为什么 GPU 适合大规模并行计算；
- 为什么大量小 op 会有 kernel launch 开销；
- 为什么 attention、KV cache、RMSNorm、RoPE、sampling、quantization 需要专门 kernel；
- 为什么 tensor layout、stride、contiguous 会影响性能；
- 为什么 FlashAttention、PagedAttention、FlashInfer、CUTLASS、Triton 这些名字会反复出现；
- vLLM / SGLang 的 attention backend 为什么依赖底层硬件和 kernel 实现。

但是，CUDA 不应该排在第一步。更合理的顺序是：

```text
PyTorch tensor / profiler
→ Operator / Kernel 基础
→ CUDA/GPU 编程模型
→ Triton 小 kernel
→ Transformers / KV cache / toy serving
→ vLLM / SGLang attention backend
→ CUDA C++ / CUTLASS / FlashAttention 深入
```

## 2. CUDA-first 标准环境

推荐标准环境：

| 组件 | 建议 |
|---|---|
| OS | Linux，优先 Ubuntu LTS |
| GPU | NVIDIA GPU，至少 12GB 显存，24GB+ 更舒服 |
| Driver | 与 CUDA / PyTorch CUDA wheel 兼容 |
| CUDA Toolkit | 与项目和 PyTorch 版本匹配 |
| Python stack | PyTorch CUDA、Transformers、Triton、vLLM、SGLang |
| Profiling | `torch.profiler`、Nsight Systems、Nsight Compute、`nvidia-smi` |

最低可用硬件：

| 显存 | 适合内容 |
|---:|---|
| 8GB | tensor / profiler / 小模型 / toy serving，容易 OOM |
| 12GB | 0.5B-1.5B 模型、基础 vLLM/SGLang 实验 |
| 16GB | 1.5B-3B 更舒服，7B 需要谨慎或量化 |
| 24GB+ | 7B、long context、benchmark、prefix cache、quantization 更完整 |
| 多卡 | tensor parallel、all-reduce、分布式 serving、PD disaggregation |

## 3. CUDA 学习分层

### Level 1：必须理解的 GPU 概念

这一级是必须掌握的，即使你不写 CUDA C++。

| 概念 | 为什么重要 |
|---|---|
| kernel launch | 多个小 op 为什么会有启动开销 |
| thread / block / grid | GPU 如何组织并行计算 |
| warp | NVIDIA GPU 的基本线程执行单位之一 |
| SM | Streaming Multiprocessor，GPU 执行资源的核心单位 |
| global memory / HBM | 大量 LLM 推理瓶颈来自显存带宽 |
| shared memory | block 内更快的共享存储 |
| register | 每个线程的高速私有存储 |
| memory coalescing | 连续访问为什么通常更快 |
| occupancy | 线程/资源占用如何影响吞吐 |
| synchronization | 并行计算中为什么要同步 |
| stream | GPU 异步执行和任务队列 |
| CUDA graph | 减少重复 launch overhead 的重要机制 |
| profiler | 不 profile 就无法判断真正瓶颈 |

### Level 2：应该能读简单 CUDA kernel

你应该能看懂下面这种代码：

```cpp
__global__ void add_kernel(const float* x, const float* y, float* out, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < n) {
        out[i] = x[i] + y[i];
    }
}
```

需要能解释：

- `__global__` 是什么；
- `blockIdx.x`、`threadIdx.x`、`blockDim.x` 是什么；
- 为什么要判断 `i < n`；
- 为什么这个 kernel 能并行处理数组；
- host 代码如何 launch kernel；
- CPU 和 GPU 同步发生在哪里。

### Level 3：能写简单 CUDA / Triton kernel

适合练习：

```text
vector add
fused elementwise op
reduction
softmax
RMSNorm
RoPE
simple transpose
simple matmul
```

不建议一开始写：

```text
FlashAttention
PagedAttention
高性能 GEMM
INT4 quantization kernel
MoE dispatch kernel
multi-GPU communication kernel
```

### Level 4：长期深入方向

这一级属于性能优化方向，不是第一个月目标。

包括：

- shared memory tiling；
- bank conflict；
- register pressure；
- occupancy tuning；
- warp-level primitives；
- tensor cores；
- async copy；
- CUTLASS；
- CuTe；
- FlashAttention implementation；
- FlashInfer / attention backend internals；
- CUDA graph；
- NCCL / all-reduce；
- multi-GPU tensor parallel。

## 4. CUDA 和 Triton 的关系

Triton 可以作为 CUDA C++ 之前的第一门 kernel DSL。

| 维度 | Triton | CUDA C++ |
|---|---|---|
| 学习成本 | 较低 | 较高 |
| 语法 | Python-like DSL | C++ 扩展 |
| 控制力 | 中到高 | 最高 |
| 调试成本 | 中 | 高 |
| 适合入门任务 | vector add、softmax、RMSNorm、RoPE、fused op | vector add、reduction、shared memory、simple matmul |
| 高阶任务 | 部分 attention / fused kernels | FlashAttention、CUTLASS、底层 backend |

推荐顺序：

```text
先用 Triton 建立 kernel 直觉
→ 再用 CUDA C++ 理解底层执行细节
→ 最后读 FlashAttention / FlashInfer / CUTLASS / vLLM backend
```

## 5. CUDA 在 vLLM / SGLang 中的位置

### vLLM

CUDA/GPU 编程模型主要影响：

- attention backend；
- paged attention；
- KV cache layout；
- block table；
- model runner 输入组织；
- sampling / logits processing；
- quantization kernel；
- tensor parallel / NCCL；
- CUDA graph；
- profiler / benchmark。

读 vLLM 时要问：

1. scheduler 为什么要生成这些 metadata？
2. KV cache manager 为什么要按 block 管理？
3. block table 如何传给 attention backend？
4. attention backend 需要哪些 tensor、position、cache 信息？
5. CUDA graph 对 serving latency 有什么影响？
6. 不同 backend 为什么支持的 dtype / shape / GPU 架构不同？

### SGLang

CUDA/GPU 编程模型主要影响：

- runtime scheduler；
- token pool / KV pool；
- radix cache；
- attention backend；
- sampling；
- structured output 的 logits processing；
- speculative decoding；
- quantization；
- multi-GPU serving。

读 SGLang 时要问：

1. radix cache 命中后如何影响 prefill 计算？
2. KV pool 如何组织底层 attention 输入？
3. structured output 会不会增加 decode step 的 CPU/GPU 开销？
4. prefix reuse 主要改善 TTFT 还是 TPOT？
5. runtime scheduler 和底层 kernel 的边界在哪里？

## 6. 一个月计划中 CUDA 怎么安排

### 第一个月目标

第一个月只要求达到：

```text
理解 CUDA/GPU 编程模型
能读简单 CUDA kernel
能写或跑通 Triton 小 kernel
能用 profiler 看到 CUDA ops
能把 vLLM/SGLang attention backend 和 CUDA kernel 连接起来理解
```

第一个月不要求：

```text
手写高性能 CUDA kernel
手写 FlashAttention
深入 CUTLASS / CuTe
改 vLLM attention backend
改 SGLang runtime kernel
做 NCCL 多机通信优化
```

### 插入位置

```text
Week 1:
  PyTorch CUDA + tensor layout + profiler + CUDA/GPU 概念

Week 2:
  Transformers + KV cache，并理解 attention / KV cache 为什么吃显存和带宽

Week 3:
  toy serving + benchmark，用 profiler 观察 workload 对 GPU 的影响

Week 4:
  vLLM / SGLang 最小闭环，阅读 attention backend / KV cache metadata 主路径
```

## 7. 推荐 CUDA labs

建议新增实验目录：

```text
cuda_labs/
├── 00_check_cuda.py
├── 01_vector_add.cu
├── 02_reduction.cu
├── 03_simple_softmax.cu
├── 04_cuda_streams.py
├── 05_torch_profiler_cuda.py
└── README.md
```

### Lab 0：检查 CUDA 环境

目标：确认 PyTorch CUDA 和 GPU 可用。

```python
import torch

print("torch:", torch.__version__)
print("cuda available:", torch.cuda.is_available())
if torch.cuda.is_available():
    print("device:", torch.cuda.get_device_name(0))
    print("capability:", torch.cuda.get_device_capability(0))
```

### Lab 1：CUDA vector add

目标：理解 thread / block / grid / kernel launch。

需要回答：

- 一个 block 有多少 threads；
- grid 里有多少 blocks；
- 每个 thread 负责哪个元素；
- 为什么要做边界检查；
- host 端如何同步 GPU。

### Lab 2：Reduction

目标：理解并行归约和同步。

需要回答：

- 为什么 reduction 比 elementwise 更复杂；
- block 内同步为什么必要；
- shared memory 如何减少 global memory 访问。

### Lab 3：Simple softmax

目标：连接 Transformer attention。

需要回答：

- softmax 为什么需要 max trick；
- reduction 和 normalization 如何组合；
- 为什么高性能 attention 里 softmax 是关键步骤。

### Lab 4：CUDA streams

目标：理解异步执行。

需要回答：

- CPU launch kernel 后是否立即等待；
- stream 如何组织任务；
- 为什么 benchmark 需要显式同步；
- 为什么没同步时计时会错。

### Lab 5：Profiler

目标：用 `torch.profiler` 和 Nsight 工具观察 CUDA ops。

需要回答：

- CPU time 和 CUDA time 的区别；
- kernel launch overhead 如何观察；
- GPU utilization 低可能有哪些原因；
- profiler 结果如何指导下一步实验。

## 8. CUDA 学习资源顺序

### 第一轮：必须看

1. CUDA C++ Programming Guide：只看 programming model、thread hierarchy、memory hierarchy、asynchronous execution；
2. CUDA C++ Best Practices Guide：只看 memory access、occupancy、profiling；
3. PyTorch Profiler 文档；
4. Triton Tutorials：vector add、matmul、softmax；
5. vLLM attention backend 文档。

### 第二轮：后续深入

1. Nsight Systems；
2. Nsight Compute；
3. CUTLASS；
4. CuTe；
5. FlashAttention；
6. FlashAttention-2；
7. FlashInfer；
8. vLLM CUDA / Triton backend 源码；
9. SGLang runtime / backend 源码。

## 9. 判断自己是否达到 CUDA 入门要求

完成本模块后，应该能回答：

1. 什么是 kernel launch？
2. thread、block、grid 的关系是什么？
3. warp 是什么？
4. global memory、shared memory、register 的区别是什么？
5. memory coalescing 为什么重要？
6. 为什么 GPU 操作常常是异步的？
7. 为什么 benchmark 需要 `torch.cuda.synchronize()`？
8. Triton 和 CUDA C++ 的关系是什么？
9. vLLM 的 attention backend 为什么需要 KV cache metadata？
10. SGLang 的 radix cache 命中为什么能减少 prefill？

## 10. 不建议的学习方式

不要这样：

```text
一开始就完整啃 CUDA Programming Guide
→ 马上写 FlashAttention
→ 没有 profiler
→ 不理解 KV cache / serving workload
→ 看不懂 vLLM/SGLang 为什么需要 scheduler metadata
```

建议这样：

```text
PyTorch tensor
→ profiler
→ CUDA/GPU 概念
→ Triton 小 kernel
→ Transformers / KV cache
→ serving benchmark
→ vLLM / SGLang backend
→ CUDA C++ 深入
```

## 11. 与开源贡献的关系

如果你只做：

- 文档；
- examples；
- issue reproduction；
- benchmark；
- OpenAI-compatible API；
- structured output 示例；

那么 CUDA Level 1-2 足够。

如果你要做：

- attention backend；
- paged attention；
- KV cache layout；
- sampling kernel；
- quantization kernel；
- CUDA graph；
- tensor parallel；
- FlashAttention / FlashInfer；

那么需要逐步进入 CUDA Level 3-4。

## 12. 本仓库的 CUDA-first 原则

本仓库后续默认：

```text
NVIDIA GPU
PyTorch CUDA
Triton CUDA
CUDA / CUTLASS / FlashAttention / FlashInfer
vLLM / SGLang CUDA path
```

非 CUDA 后端、国产硬件、Paddle custom device 等内容可以作为扩展阅读或对照材料，但不作为主线学习环境。