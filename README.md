# infra-basic

`infra-basic` 是一条面向 **LLM 推理基础设施** 的学习路线。它以 **CUDA-first / NVIDIA 标准环境** 为默认主线，从 PyTorch / Transformers 推理开始，逐步进入 Operator / Kernel、CUDA/GPU 编程模型、KV Cache、serving、benchmark、vLLM、SGLang、论文阅读和开源贡献。

本仓库不教学 Linux / Python / Git 零基础。默认学习者已经能完成基本命令行操作、Python 脚本编写、虚拟环境管理和 Git 提交。

## 默认环境

本仓库默认使用：

```text
Linux
→ NVIDIA GPU
→ NVIDIA Driver
→ CUDA Toolkit
→ PyTorch CUDA
→ Triton CUDA
→ vLLM / SGLang CUDA path
```

非 CUDA 后端、AMD/ROCm、国产硬件、Paddle custom device 等内容可以作为扩展阅读或对照材料，但不作为主线学习环境。

## 学习目标

完成本路线后，学习者应该能够：

1. 用 PyTorch CUDA 和 Transformers 跑通小模型推理；
2. 解释 autoregressive decoding、prefill、decode、sampling、KV Cache、batching；
3. 理解 Python、operator、kernel、Triton、CUDA、custom op 之间的关系；
4. 理解 CUDA/GPU 编程模型中的 thread、block、grid、warp、SM、memory hierarchy、kernel launch；
5. 写一个极简 LLM HTTP serving demo，并完成基础压测；
6. 理解 vLLM 的 API server、engine、scheduler、KV cache manager、model runner、attention backend；
7. 理解 SGLang 的 runtime、RadixAttention、structured output、prefix cache、offline engine；
8. 读懂 LLM serving 领域的基础、经典和较新的论文；
9. 以文档、测试、benchmark、bug reproduction、小功能为入口参与 vLLM / SGLang 开源贡献。

## 推荐阅读顺序

```text
README.md
└── docs/00-roadmap.md
    ├── docs/08-one-month-plan.md
    ├── projects/README.md
    ├── docs/07-operator-kernels.md
    ├── docs/09-cuda-gpu-programming.md
    ├── docs/01-paper-syllabus.md
    ├── docs/06-bibliography.md
    ├── docs/02-vllm-plan.md
    ├── docs/03-sglang-plan.md
    ├── docs/04-troubleshooting.md
    └── docs/05-open-source-playbook.md
```

## 仓库结构

```text
infra-basic/
├── README.md
├── docs/
│   ├── 00-roadmap.md
│   ├── 01-paper-syllabus.md
│   ├── 02-vllm-plan.md
│   ├── 03-sglang-plan.md
│   ├── 04-troubleshooting.md
│   ├── 05-open-source-playbook.md
│   ├── 06-bibliography.md
│   ├── 07-operator-kernels.md
│   ├── 08-one-month-plan.md
│   └── 09-cuda-gpu-programming.md
└── projects/
    └── README.md
```

## 学习原则

```text
先跑通 → 再复现 → 再 benchmark → 再读源码 → 再改代码 → 再贡献 PR
```

不要一开始直接啃复杂 CUDA kernel、分布式部署或大规模生产架构。先把 PyTorch tensor、operator/kernel、CUDA/GPU 编程模型、单请求生成、batch、prefill/decode、KV cache、continuous batching、prefix cache 这些主路径建立起来。

## 最小硬件建议

| 环境 | 可以做什么 |
|---|---|
| 无 GPU | tokenizer、toy decoding、论文、源码阅读、API demo、operator 概念学习 |
| NVIDIA 8GB GPU | PyTorch CUDA、tensor/profiler、小模型、toy serving，容易 OOM |
| NVIDIA 12GB-16GB GPU | 0.5B-3B 模型基础推理、toy server、轻量 vLLM/SGLang 实验、Triton 小 kernel |
| NVIDIA 24GB+ GPU | 更完整的 benchmark、prefix cache、long context、quantization、kernel profiling 实验 |
| 多张 NVIDIA GPU | tensor parallel、pipeline parallel、NCCL、PD disaggregation、分布式 serving、通信相关 profiling |

## 一月计划

如果目标是在一个月内完成入门闭环，优先看：`docs/08-one-month-plan.md`。

一个月足够完成：

- PyTorch CUDA 推理基础；
- Operator / Kernel 基础；
- CUDA/GPU 编程模型基础；
- Transformers naive decoding；
- KV cache 对比实验；
- toy serving + benchmark；
- vLLM / SGLang 最小实验；
- 第一个开源贡献入口准备。

一个月不够深入掌握：

- vLLM / SGLang 核心调度；
- attention backend 深度优化；
- CUDA / CUTLASS / FlashAttention 实现；
- 多机分布式 serving；
- 稳定提交核心模块 PR。

## 核心评价指标

学习过程中持续记录这些指标，而不是只看“能不能跑”：

- TTFT: Time To First Token
- ITL / TPOT: Inter-Token Latency / Time Per Output Token
- E2E latency
- requests/s
- output tokens/s
- total tokens/s
- GPU memory usage
- GPU utilization
- operator / kernel profiling 结果
- CUDA kernel / Triton kernel profiling 结果
- 模型、commit、启动参数、benchmark workload
