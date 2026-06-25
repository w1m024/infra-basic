# Kernel 库

底层 kernel library 是理解 LLM 推理性能的关键。不要一开始就写复杂 kernel，但应该知道每个库解决的问题，以及它们如何被 vLLM、SGLang、TensorRT-LLM、DeepSeek stack 等上层系统调用。

## 重点项目

| 项目 | 官方入口 | 学习重点 |
|---|---|---|
| FlashAttention | https://github.com/Dao-AILab/flash-attention | IO-aware attention、tiling、HBM 访问、长序列 attention |
| FlashInfer | https://github.com/flashinfer-ai/flashinfer | LLM serving attention / sampling kernels、paged KV、decode optimization |
| FlashMLA | https://github.com/deepseek-ai/FlashMLA | DeepSeek MLA / sparse attention / FP8 KV cache |
| DeepGEMM | https://github.com/deepseek-ai/DeepGEMM | FP8 / FP4 / BF16 GEMM、MoE GEMM、JIT CUDA kernel |
| DeepEP | https://github.com/deepseek-ai/DeepEP | MoE expert parallel、all-to-all、dispatch / combine |
| CUTLASS / CuTe | https://github.com/NVIDIA/cutlass | tensor core GEMM、tiling、CuTe DSL、Hopper / Blackwell optimization |
| Triton | https://github.com/triton-lang/triton | Python-like kernel DSL、JIT、custom op prototyping |

## 学习顺序

```text
Triton vector add / softmax / matmul
→ FlashAttention paper + code structure
→ FlashInfer serving kernels
→ FlashMLA for MLA attention
→ DeepGEMM for FP8 / MoE GEMM
→ DeepEP for expert parallel communication
→ CUTLASS / CuTe for long-term GEMM depth
```

## 关键概念

| 概念 | 为什么重要 |
|---|---|
| kernel launch | 小 op latency 和 CUDA graph 的基础 |
| memory bandwidth | attention / KV cache 常受 HBM 限制 |
| tensor core | FP16/BF16/FP8 GEMM 性能核心 |
| tiling | FlashAttention、GEMM、softmax 的核心优化方式 |
| FP8 scaling | DeepSeek / TensorRT-LLM 等高性能推理的重要路径 |
| paged KV | serving attention backend 与 runtime metadata 的连接点 |
| MoE all-to-all | 大 MoE 模型扩展时的通信瓶颈 |

## 源码阅读目标

1. kernel API 需要哪些 tensor、shape、stride、metadata；
2. 上层 runtime 如何构造 block table、positions、cache metadata；
3. prefill 和 decode kernel 为什么不同；
4. FP8 / INT4 / quantized kernel 如何处理 scale；
5. MoE dispatch / combine 和 GEMM 如何衔接；
6. profiler 如何证明瓶颈在 memory、compute、launch 还是 communication。

## 通过标准

能解释：

1. 为什么 LLM serving 不能只依赖通用 PyTorch op；
2. attention backend 为什么需要 runtime 准备 metadata；
3. FlashAttention、FlashInfer、FlashMLA 的定位差异；
4. DeepGEMM 和 CUTLASS 的关系与差异；
5. DeepEP 为什么属于 MoE serving 的关键基础设施。
