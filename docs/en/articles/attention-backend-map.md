# Attention Backend Map

Comparison targets: FlashAttention, FlashInfer, CUTLASS, Triton, FlashMLA, DeepGEMM.

## Bottlenecks Each Solves

| Project | Focus |
|---|---|
| FlashAttention | IO-aware attention baseline |
| FlashInfer | Serving-oriented attention, sampling, decode/prefill combinations |
| CUTLASS | CUDA template primitives, GEMM, Tensor Core abstractions |
| Triton | Python JIT kernel language, compiler, runtime |
| FlashMLA | MLA attention kernel |
| DeepGEMM | FP8 GEMM, grouped GEMM, MoE GEMM |

## How Serving Engines Connect to Backends

Serving engines handle shape, KV cache blocks, batch, and backend selection. Kernel libraries handle launch parameters, tiles, memory movement, compute, and store.

## Reading Boundary

Start with Python/C++ API, then planner/autotuner, finally enter CUDA/Triton/CUTLASS kernel. Don't start by reading the innermost mma instructions.
