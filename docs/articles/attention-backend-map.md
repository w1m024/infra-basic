# Attention Backend Map

比较对象：FlashAttention、FlashInfer、CUTLASS、Triton、FlashMLA、DeepGEMM。

## 各自解决的瓶颈

| 项目 | 重点 |
|---|---|
| FlashAttention | IO-aware attention baseline |
| FlashInfer | serving-oriented attention、sampling、decode/prefill 组合 |
| CUTLASS | CUDA template primitives、GEMM、Tensor Core 抽象 |
| Triton | Python JIT kernel language、compiler、runtime |
| FlashMLA | MLA attention kernel |
| DeepGEMM | FP8 GEMM、grouped GEMM、MoE GEMM |

## Serving engine 如何连接 backend

Serving engine 负责 shape、KV cache block、batch 和 backend selection。Kernel library 负责 launch 参数、tile、memory movement、compute 和 store。

## 阅读边界

先看 Python/C++ API，再看 planner/autotuner，最后进入 CUDA/Triton/CUTLASS kernel。不要一开始就读最内层 mma 指令。
