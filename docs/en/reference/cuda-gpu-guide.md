# P2 CUDA GPU Programming Intro

## Goal

Understand the CUDA/GPU programming model as it applies to LLM inference infrastructure.

## Key Topics

- Thread hierarchy: thread, warp, block, grid
- Memory hierarchy: registers, shared memory, global memory, HBM
- Kernel launch: grid dimensions, block dimensions, occupancy
- Tensor layout: stride, contiguous, memory access patterns

## Is CUDA Required?

You must understand the CUDA/GPU programming model, but you don't need to write complex CUDA kernels in the first month. The goal is to understand:

- Why GPUs are suitable for massive parallel computation
- Why many small ops have kernel launch overhead
- Why attention, KV cache, RMSNorm, RoPE, sampling, quantization need specialized kernels
- Why tensor layout, stride, contiguous affect performance

## Recommended Order

```text
PyTorch tensor / profiler
→ Operator / Kernel basics
→ CUDA/GPU programming model
→ Triton small kernel
→ Transformers / KV cache / toy serving
→ vLLM / SGLang attention backend
→ CUDA C++ / CUTLASS / FlashAttention deep dive
```

## Pass Criteria

You can explain thread/block/grid concepts and write a minimal Triton kernel.
