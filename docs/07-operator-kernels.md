# 07. Operator and Kernel Learning Guide

本文档解释 LLM 推理基础设施中经常出现的“算子”“kernel”“写算子语言”等概念，并说明它们和 Python、PyTorch、vLLM、SGLang、PaddlePaddle 的关系。

目标不是让初学者一开始就写高性能 CUDA kernel，而是建立一条合理路线：

```text
会用算子
→ 会看算子
→ 会 profile 算子
→ 会写简单 Triton kernel
→ 会理解 custom op 注册
→ 会读 vLLM / SGLang kernel 接口
→ 再深入 CUDA / CUTLASS / FlashAttention / FlashInfer
```

## 1. Python、Operator、Kernel 的关系

Python 和“写算子语言”不是替代关系，而是上下层关系。

```text
Python code
→ PyTorch / Paddle / vLLM / SGLang API
→ Operator / Dispatcher / Runtime
→ CUDA / Triton / C++ / SYCL / Custom Kernel
→ GPU / NPU / XPU / CPU hardware
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
- 在 GPU / NPU / XPU 上并行计算。

一个典型例子：

```python
y = torch.matmul(x, w)
```

这行 Python 不会自己逐元素计算矩阵乘。Python 只是发起调用，真正的计算通常由底层库或 kernel 完成。

## 2. 什么是 Operator？

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
| dispatch 规则 | CPU / CUDA / ROCm / XPU / MPS 等设备走哪个实现 |
| autograd 支持 | 训练时反向传播如何实现 |
| compiler 支持 | `torch.compile` / graph compiler 如何处理 |
| kernel 实现 | 真正跑在硬件上的底层实现 |

不要把 operator 和 kernel 完全等同。一个 operator 可能有多个 kernel 实现。

```text
layer_norm operator
├── CPU kernel
├── CUDA kernel
├── ROCm kernel
├── Triton kernel
├── XPU / SYCL kernel
└── NPU custom kernel
```

## 3. 什么是 Kernel？

Kernel 是实际在硬件上执行的底层代码。

在 GPU 场景下，kernel 通常指：

- CUDA kernel；
- Triton JIT kernel；
- HIP / ROCm kernel；
- SYCL kernel；
- 某些硬件厂商提供的 custom kernel。

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
| All-reduce / communication | tensor parallel 多 GPU 推理关键 |

对 vLLM / SGLang 初学者，优先关注：

```text
RMSNorm
RoPE
KV cache movement
attention backend
sampling
quantization / dequantization
```

不要一开始就手写 GEMM。高性能 GEMM 是非常深的主题，早期只需要理解它为什么重要。

## 4. Python 为什么还必须学？

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

这里 Python 只是调用底层 operator，真正计算由底层 kernel 执行。

## 5. 常见“写算子语言”和工具

### 5.1 PyTorch Tensor API

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

### 5.2 Triton

Triton 看起来像 Python，但不是普通 Python。它是 Python-like 的 GPU kernel DSL。

执行链路：

```text
Triton code
→ JIT compile
→ GPU kernel
→ 在 GPU 上执行
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

### 5.3 CUDA C++

CUDA C++ 是 NVIDIA GPU 上最核心的底层编程方式之一。

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

建议放在 Triton 之后学习。

### 5.4 C++ / CUDA Custom Operator

custom op 的核心不是“写 C++”，而是解决：

```text
我写了底层实现
→ 如何注册成框架 operator
→ 如何让 Python 调用
→ 如何测试
→ 如何和 autograd / compiler / fake tensor 配合
```

PyTorch 和 Paddle 都有 custom op / custom kernel 机制。

### 5.5 PaddlePaddle Custom Op / Custom Kernel

PaddlePaddle 中也有类似结构：

```text
Paddle Python API
→ Paddle operator
→ C++ custom op
→ custom kernel
→ custom device / accelerator
```

适合关注：

- PaddlePaddle；
- PaddleNLP；
- Paddle Inference；
- Paddle Custom Device；
- 国产硬件适配；
- XPU / NPU / 其他加速器；
- 算子迁移和性能优化。

如果主要目标是 vLLM / SGLang，Paddle custom op 可以先作为对照学习，不必放在主线最前面。

## 6. LLM Serving 为什么关心算子？

LLM 推理性能瓶颈通常在：

```text
GPU 算力
显存带宽
KV cache 访问
attention kernel
GEMM
normalization
quantization / dequantization
sampling
多 GPU 通信
```

vLLM / SGLang 不是纯 Python server。它们把 Python 层的调度、请求管理、模型管理和底层高性能 kernel 组合起来。

可以这样理解：

```text
Python side:
  API server
  scheduler
  request state
  config
  benchmark
  tests

Kernel side:
  attention
  KV cache read/write
  RMSNorm / LayerNorm
  RoPE
  sampling
  quantization
  all-reduce
```

## 7. Tensor 基础：写算子前必须会

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
| device | CPU / CUDA / XPU / NPU |
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

## 8. Profiler：先会看算子，再写算子

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

## 9. Fusion：很多算子优化的核心

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

## 10. 推荐学习路线

### 阶段 A：会用算子

目标：熟悉 PyTorch tensor op。

必会：

```text
shape
stride
contiguous
view / reshape
transpose
broadcast
dtype
device
in-place op
```

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

### 阶段 C：会写简单 Triton kernel

目标：用 Triton 写最小 kernel。

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

### 阶段 D：理解 custom op 注册

目标：知道底层实现如何接入框架。

需要理解：

- operator schema；
- dispatcher；
- CPU / CUDA kernel 注册；
- fake tensor / meta kernel；
- autograd；
- `torch.compile` 兼容；
- 测试。

交付物：

```text
operator_labs/custom_op_notes.md
```

### 阶段 E：读 vLLM / SGLang kernel 接口

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

### 阶段 F：再进入 CUDA C++

目标：理解底层 GPU 编程。

先学：

```text
thread / block / grid
warp
SM
shared memory
register
global memory / HBM
memory coalescing
occupancy
kernel launch
```

不要一开始就写复杂 attention kernel。先写：

```text
vector add
reduction
softmax
layernorm
simple matmul
```

## 11. vLLM / SGLang 中的对应关系

### vLLM

vLLM 中，operator/kernel 相关内容主要出现在：

```text
attention backend
paged attention
KV cache manager
model runner
sampling
quantization
multi-GPU communication
```

阅读时要问：

1. scheduler 为什么要生成这些 metadata？
2. model runner 传给 backend 的 tensor 分别是什么？
3. block table 和 KV cache layout 如何影响 attention？
4. prefix caching 对 kernel 输入有什么影响？
5. 不同 attention backend 的适用条件是什么？

### SGLang

SGLang 中，operator/kernel 相关内容主要出现在：

```text
runtime scheduler
memory pool
radix cache
attention backend
structured output decoding
sampling
speculative decoding
```

阅读时要问：

1. radix cache 如何影响 KV reuse？
2. token pool / KV pool 与底层 kernel 输入如何对应？
3. structured output 会如何影响 logits processing？
4. constrained decoding 是否让每步 decode 更慢？
5. prefix cache 命中主要改善 TTFT 还是 TPOT？

## 12. PaddlePaddle 作为对照学习

Paddle 的 custom op / custom kernel 适合作为“框架如何接入底层算子”的对照案例。

推荐关注点：

| 主题 | 要问的问题 |
|---|---|
| Custom C++ Op | 如何定义输入输出和注册算子 |
| Custom Kernel | 如何给已有 operator 提供设备 kernel |
| Custom Device | 如何支持外部设备和硬件 runtime |
| PaddleNLP / Paddle Inference | 推理侧如何调用底层 kernel |
| 国产硬件适配 | XPU / NPU / 其他加速器如何接入 |

如果主线是 vLLM / SGLang，Paddle 先作为扩展方向；如果主线是国产框架或国产硬件，Paddle custom op / custom kernel 可以提前学习。

## 13. 不建议的学习顺序

不要这样：

```text
直接学 CUDA
→ 直接写 FlashAttention
→ 不知道 tensor stride / profiler / operator schema
→ 看不懂 vLLM / SGLang 为什么要这些 metadata
→ 卡住
```

建议这样：

```text
PyTorch tensor layout
→ torch.profiler
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
9. Paddle custom op / custom kernel 和 PyTorch custom op 有什么相似处？
10. vLLM / SGLang 中为什么 attention backend、KV cache layout、sampling kernel 很重要？

## 15. 推荐放入当前学习路线的位置

建议插入在 PyTorch 推理基础之后、Transformers 生成过程之前或之后：

```text
PyTorch 推理基础
→ Operator / Kernel 基础
→ Transformers 生成过程
→ KV Cache / prefill / decode
→ toy serving + benchmark
→ vLLM
→ SGLang
→ 论文和开源贡献
```

原因：

- 太早学 CUDA 会分散注意力；
- 完全不懂 operator/kernel 又会影响后续理解 attention backend；
- 先掌握 tensor layout 和 profiler，能显著提高阅读 vLLM / SGLang 源码的效率。
