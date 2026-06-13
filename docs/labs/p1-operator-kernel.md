# 07. Operator and Kernel Learning Guide

本文档解释 LLM 推理基础设施中经常出现的“算子”“kernel”“写算子语言”等概念，并说明它们和 Python、PyTorch、vLLM、SGLang 的关系。

本仓库采用 **CUDA-first / NVIDIA 标准环境**。后续 operator、kernel、profiler、Triton、attention backend 相关内容，默认按下面环境理解：

```text
Linux
→ NVIDIA GPU
→ NVIDIA Driver
→ CUDA Toolkit
→ PyTorch CUDA
→ Triton CUDA
→ vLLM / SGLang CUDA path
```

非 CUDA 后端、AMD/ROCm、国产硬件、Paddle custom device 等只作为扩展阅读或对照材料，不作为本仓库主线。

## 1. 推荐学习顺序

目标不是让初学者一开始就写高性能 CUDA kernel，而是建立一条合理路线：

```text
会用算子
→ 会看算子
→ 会 profile 算子
→ 理解 CUDA/GPU 编程模型
→ 会写简单 Triton CUDA kernel
→ 会理解 PyTorch custom op 注册
→ 会读 vLLM / SGLang kernel 接口
→ 再深入 CUDA C++ / CUTLASS / FlashAttention / FlashInfer
```

对应 CUDA 专项见：`docs/09-cuda-gpu-programming.md`。

## 2. Python、Operator、Kernel 的关系

Python 和“写算子语言”不是替代关系，而是上下层关系。

```text
Python code
→ PyTorch / vLLM / SGLang API
→ Operator / Dispatcher / Runtime
→ CUDA / Triton / C++ Custom Kernel
→ NVIDIA GPU
```

Python 通常负责：

- 加载模型；
- 组织 tensor；
- 调用框架 API；
- 写 server；
- 写 scheduler；
- 写 benchmark；
- 写测试；
- 调用底层算子。

底层 kernel 负责：

- 真正执行矩阵乘；
- 执行 attention；
- 执行 norm；
- 读写 KV cache；
- 做 sampling；
- 做 quantization / dequantization；
- 在 NVIDIA GPU 上并行计算。

一个典型例子：

```python
y = torch.matmul(x, w)
```

这行 Python 不会自己逐元素计算矩阵乘。Python 只是发起调用，真正的计算通常由底层 CUDA library、Triton kernel 或 PyTorch 内部 kernel 完成。

## 3. 什么是 Operator？

框架层的 operator 可以理解为一个计算单元，例如：

```python
torch.matmul(a, b)
torch.add(x, y)
torch.nn.functional.layer_norm(x, normalized_shape)
torch.nn.functional.scaled_dot_product_attention(q, k, v)
```

一个 operator 通常包括：

| 组成 | 说明 |
|---|---|
| 算子名 | 例如 `matmul`, `add`, `layer_norm` |
| 输入输出 schema | 输入几个 tensor，输出几个 tensor |
| shape / dtype 规则 | 输出 shape 如何推导，支持哪些 dtype |
| dispatch 规则 | CPU / CUDA 等不同设备走哪个实现 |
| autograd 支持 | 训练时反向传播如何实现 |
| compiler 支持 | `torch.compile` / graph compiler 如何处理 |
| kernel 实现 | 真正跑在硬件上的底层实现 |

不要把 operator 和 kernel 完全等同。一个 operator 可能有多个 kernel 实现。

```text
layer_norm operator
├── CPU kernel
├── CUDA kernel
├── Triton kernel
└── custom C++ / CUDA kernel
```

## 4. 什么是 Kernel？

Kernel 是实际在硬件上执行的底层代码。

在本仓库主线中，kernel 通常指：

- CUDA kernel；
- Triton CUDA JIT kernel；
- C++ / CUDA custom operator；
- vLLM / SGLang attention backend 内部调用的底层 kernel。

LLM 推理中常见的热点 kernel 包括：

| Kernel / 算子 | 为什么重要 |
|---|---|
| GEMM / MatMul | Transformer 线性层主要由矩阵乘组成 |
| Attention / FlashAttention / PagedAttention | 长上下文和 KV cache 的核心瓶颈 |
| RMSNorm / LayerNorm | 每层都会用，适合 fusion |
| RoPE | 位置编码，decode 阶段频繁使用 |
| KV cache copy / gather / scatter | serving 系统中的关键数据移动 |
| Sampling / logits processing | top-k、top-p、temperature、penalty |
| Quantization / dequantization | INT8 / INT4 / FP8 推理性能和显存关键 |
| MoE dispatch / combine | MoE 模型中的专家路由和合并 |
| All-reduce / NCCL communication | tensor parallel 多 GPU 推理关键 |

对 vLLM / SGLang 初学者，优先关注：

```text
RMSNorm
RoPE
KV cache movement
attention backend
sampling
quantization / dequantization
NCCL communication
```

不要一开始就手写 GEMM。高性能 GEMM 是非常深的主题，早期只需要理解它为什么重要。

## 5. 为什么 Python 仍然必须学？

需要继续学 Python，但不是基础语法，而是工程型 Python。

LLM infra 中的 Python 主要用于：

| 能力 | 用途 |
|---|---|
| `asyncio` | streaming、异步请求、server |
| `multiprocessing` | worker、engine、进程隔离 |
| `dataclasses` / `pydantic` | 配置、请求对象、参数管理 |
| `pytest` | 开源项目测试 |
| `typing` | 读大型项目代码 |
| `subprocess` | benchmark、启动 server、自动化脚本 |
| `logging` | issue reproduction 和 debug |
| profiling | 定位 Python 侧瓶颈 |
| packaging | 源码安装、构建 extension |
| HTTP / FastAPI | OpenAI-compatible server |
| JSON / SSE | chat completion 和 streaming |

Python 慢的是逐元素循环：

```python
for i in range(n):
    y[i] = x[i] + 1
```

但 Python 调 tensor operator 通常不是这种执行方式：

```python
y = torch.add(x, 1)
```

这里 Python 只是调用底层 operator，真正计算由底层 CUDA / Triton kernel 执行。

## 6. CUDA、Triton、Custom Op 的区别

### 6.1 PyTorch Tensor API

不是严格意义上的“写算子语言”，但它是最重要的计算表达层。

```python
y = torch.relu(x @ w + b)
```

优点：

- 快速表达计算；
- 易调试；
- 生态强；
- 适合实验和模型代码。

缺点：

- 多个小 op 串联可能产生多个 kernel launch；
- 可能产生中间 tensor；
- 某些性能热点需要 fusion 或 custom kernel。

### 6.2 Triton CUDA

Triton 看起来像 Python，但不是普通 Python。它是 Python-like 的 GPU kernel DSL。

执行链路：

```text
Triton code
→ JIT compile
→ CUDA kernel
→ 在 NVIDIA GPU 上执行
```

适合入门的 Triton kernel：

```text
vector add
→ fused add + relu
→ layernorm
→ RMSNorm
→ softmax
→ matmul
→ RoPE
```

不建议一开始写 FlashAttention。FlashAttention 涉及 tiling、online softmax、SRAM/HBM 访问、数值稳定性、block scheduling 等多个难点。

### 6.3 CUDA C++

CUDA C++ 是 NVIDIA GPU 上最核心的底层编程方式。

优点：

- 控制力强；
- 性能上限高；
- NVIDIA 生态成熟；
- 很多核心库、attention backend、quantization kernel 都和 CUDA/C++ 有关。

缺点：

- 学习成本高；
- 编译和调试成本高；
- 需要理解 thread、block、warp、shared memory、register、occupancy 等概念；
- 与 PyTorch / vLLM / SGLang 集成还要理解 extension 和 dispatcher。

建议：第一个月掌握 CUDA/GPU 编程模型，能读简单 CUDA kernel；第二个月之后再深入 CUDA C++ 优化。

### 6.4 C++ / CUDA Custom Operator

custom op 的核心不是“写 C++”，而是解决：

```text
我写了底层实现
→ 如何注册成 PyTorch operator
→ 如何让 Python 调用
→ 如何测试
→ 如何和 autograd / compiler / fake tensor 配合
```

学习 custom op 时重点关注：

- operator schema；
- dispatcher；
- CPU / CUDA kernel 注册；
- fake tensor / meta kernel；
- autograd；
- `torch.compile` 兼容；
- 测试。

## 7. CUDA/GPU 编程模型：必须理解

在进入复杂 kernel 前，必须掌握这些概念：

| 概念 | 必须理解的问题 |
|---|---|
| kernel launch | 为什么很多小 op 会有启动开销 |
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

CUDA 专项学习详见：`docs/09-cuda-gpu-programming.md`。

## 8. Tensor 基础：写算子前必须会

在进入 Triton / CUDA 之前，先掌握这些 PyTorch tensor 概念：

| 概念 | 必须理解的问题 |
|---|---|
| shape | tensor 每一维是什么 |
| stride | 内存中如何跳步访问 |
| contiguous | 是否连续存储，为什么 `.contiguous()` 会复制 |
| view / reshape | 什么时候只是换视图，什么时候会复制 |
| transpose | 为什么转置后通常 stride 改变 |
| broadcast | 维度扩展如何发生 |
| dtype | fp32 / fp16 / bf16 / int8 / fp8 差异 |
| device | CPU / CUDA |
| layout | 数据排布如何影响 kernel |
| in-place op | 为什么可能影响 autograd 或内存复用 |

最小实验：

```python
import torch

x = torch.randn(2, 3, 4, device="cuda")
y = x.transpose(1, 2)

print("x shape:", x.shape)
print("x stride:", x.stride())
print("x contiguous:", x.is_contiguous())

print("y shape:", y.shape)
print("y stride:", y.stride())
print("y contiguous:", y.is_contiguous())

z = y.contiguous()
print("z stride:", z.stride())
print("z contiguous:", z.is_contiguous())
```

需要能解释：

1. 为什么 `transpose` 后 tensor 可能不 contiguous；
2. 为什么某些 kernel 要求 contiguous；
3. 为什么 `.contiguous()` 可能引入额外显存和拷贝；
4. 为什么 shape 相同不代表内存布局相同。

## 9. Profiler：先会看算子，再写算子

写算子前，先学会回答：

```text
一次 forward 最慢的 op 是什么？
是 matmul？
是 attention？
是 norm？
是 tokenizer？
是 Python server？
是 GPU kernel launch 太碎？
是 CPU/GPU 同步？
```

建议工具：

- `torch.profiler`；
- `nvidia-smi`；
- Nsight Systems；
- Nsight Compute；
- vLLM / SGLang benchmark log。

最小 profiling 目标：

```text
1. 跑一次小模型 forward
2. 记录 top 10 CUDA ops
3. 区分 CPU time 和 CUDA time
4. 找到 matmul / attention / norm / copy 相关条目
5. 写出瓶颈猜测
```

## 10. Fusion：很多算子优化的核心

很多“写算子”不是创造新的数学，而是减少中间结果和 kernel launch。

未融合：

```text
x
→ add kernel
→ intermediate tensor
→ multiply kernel
→ intermediate tensor
→ activation kernel
→ output
```

融合后：

```text
x
→ fused add + multiply + activation kernel
→ output
```

潜在收益：

- 更少 kernel launch；
- 更少 HBM 读写；
- 更少中间 tensor；
- 更低延迟；
- 更好的吞吐。

但 fusion 不是永远有收益。可能的问题：

- kernel 更复杂；
- register pressure 增加；
- occupancy 下降；
- 不同 shape 下性能不稳定；
- 可维护性变差。

## 11. 推荐实验路线

### 阶段 A：会用算子

目标：熟悉 PyTorch tensor op。

交付物：

```text
operator_labs/tensor_layout.py
reports/operator_tensor_layout.md
```

### 阶段 B：会看算子

目标：用 profiler 看模型调用了哪些 op。

交付物：

```text
operator_labs/profile_forward.py
reports/operator_profile_forward.md
```

报告至少包含：

- 模型；
- 输入 shape；
- dtype；
- top CUDA ops；
- CPU time vs CUDA time；
- bottleneck guess。

### 阶段 C：理解 CUDA/GPU 编程模型

目标：能读懂简单 CUDA kernel，并理解 thread / block / grid / memory hierarchy。

交付物：

```text
cuda_labs/00_check_cuda.py
cuda_labs/01_vector_add.cu
cuda_labs/02_reduction.cu
cuda_labs/03_simple_softmax.cu
reports/cuda_gpu_programming_basics.md
```

### 阶段 D：会写简单 Triton CUDA kernel

建议顺序：

```text
vector add
→ fused add + relu
→ softmax
→ RMSNorm
→ RoPE
```

交付物：

```text
operator_labs/triton_vector_add.py
operator_labs/triton_fused_add_relu.py
operator_labs/triton_rmsnorm.py
reports/triton_basics.md
```

### 阶段 E：理解 PyTorch custom op 注册

目标：知道底层 CUDA 实现如何接入 PyTorch。

交付物：

```text
operator_labs/custom_op_notes.md
```

### 阶段 F：读 vLLM / SGLang kernel 接口

目标：知道底层 kernel 和 serving runtime 如何连接。

重点看：

- attention backend；
- paged attention metadata；
- block table；
- KV cache layout；
- RMSNorm / RoPE kernel；
- sampling kernel；
- quantization kernel；
- FlashAttention / FlashInfer / Triton backend。

交付物：

```text
operator_labs/vllm_attention_backend_notes.md
operator_labs/sglang_kernel_notes.md
```

## 12. vLLM / SGLang 中的对应关系

### vLLM

vLLM 中，operator/kernel/CUDA 相关内容主要出现在：

```text
attention backend
paged attention
KV cache manager
model runner
sampling
quantization
CUDA graph
multi-GPU NCCL communication
```

阅读时要问：

1. scheduler 为什么要生成这些 metadata？
2. model runner 传给 backend 的 tensor 分别是什么？
3. block table 和 KV cache layout 如何影响 attention？
4. prefix caching 对 kernel 输入有什么影响？
5. 不同 attention backend 的适用条件是什么？
6. CUDA graph 为什么可能降低 serving latency？

### SGLang

SGLang 中，operator/kernel/CUDA 相关内容主要出现在：

```text
runtime scheduler
memory pool
radix cache
attention backend
structured output decoding
sampling
speculative decoding
quantization
```

阅读时要问：

1. radix cache 如何影响 KV reuse？
2. token pool / KV pool 与底层 kernel 输入如何对应？
3. structured output 会如何影响 logits processing？
4. constrained decoding 是否让每步 decode 更慢？
5. prefix cache 命中主要改善 TTFT 还是 TPOT？

## 13. 不建议的学习顺序

不要这样：

```text
直接完整啃 CUDA Programming Guide
→ 直接写 FlashAttention
→ 不知道 tensor stride / profiler / operator schema
→ 看不懂 vLLM / SGLang 为什么要这些 metadata
→ 卡住
```

建议这样：

```text
PyTorch tensor layout
→ torch.profiler
→ CUDA/GPU 编程模型
→ Triton 小 kernel
→ custom op 注册概念
→ vLLM / SGLang attention backend
→ CUDA C++
→ CUTLASS / CuTe / FlashAttention 深入
```

## 14. 最小验收题

完成本模块后，应该能回答：

1. Python、operator、kernel 的区别是什么？
2. 为什么 Python 调 `torch.matmul` 不等于 Python 自己做矩阵乘？
3. 什么是 shape、stride、contiguous？
4. 为什么 `.contiguous()` 可能带来额外拷贝？
5. 什么是 kernel fusion？为什么它可能提升性能？
6. Triton 和普通 Python 有什么区别？
7. CUDA C++ 和 Triton 的学习成本、控制力、适用场景有什么区别？
8. PyTorch custom op 解决什么问题？
9. thread、block、grid、warp、SM、global memory、shared memory、register 分别是什么？
10. vLLM / SGLang 中为什么 attention backend、KV cache layout、sampling kernel 很重要？

## 15. 推荐放入当前学习路线的位置

建议插入在 PyTorch CUDA 推理基础之后、Transformers 生成过程之前或之后：

```text
PyTorch CUDA 推理基础
→ Operator / Kernel 基础
→ CUDA/GPU 编程模型
→ Transformers 生成过程
→ KV Cache / prefill / decode
→ toy serving + benchmark
→ vLLM
→ SGLang
→ 论文和开源贡献
```

原因：

- 太早深写 CUDA 会分散注意力；
- 完全不懂 CUDA/GPU 编程模型又会影响后续理解 attention backend；
- 先掌握 tensor layout、profiler、kernel launch、memory hierarchy，能显著提高阅读 vLLM / SGLang 源码的效率。