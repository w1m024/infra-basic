# P1 Operator & Kernel Intro

## Goal

Understand the concepts of "operator", "kernel", and "kernel languages" that frequently appear in LLM inference infrastructure, and their relationship to Python, PyTorch, vLLM, SGLang.

## Learning Path

```text
Use operators
→ Read operators
→ Profile operators
→ Understand CUDA/GPU programming model
→ Write simple Triton CUDA kernel
→ Understand PyTorch custom op registration
→ Read vLLM / SGLang kernel interfaces
→ Deep dive into CUDA C++ / CUTLASS / FlashAttention / FlashInfer
```

## Key Concepts

- Python and kernel languages are not alternatives - they are upper/lower layer relationships.
- Python calls operators through dispatch; operators may be implemented in Triton, CUDA, or C++.
- Profiling helps identify which operators are bottlenecks before writing kernels.

## Pass Criteria

You can explain the path from a Python operation to a CUDA kernel, and profile a simple operator.
