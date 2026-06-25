# Learning Roadmap

This roadmap is for learners who want to enter **LLM inference infrastructure** from scratch. The focus is not on training large models, but on understanding how models are efficiently served, and gradually building the ability to contribute to vLLM / SGLang open source projects.

## Core Path

```
Linux → NVIDIA GPU → NVIDIA Driver → CUDA → PyTorch CUDA
→ Operator / Kernel → Inference System → vLLM / SGLang → Open Source Contribution
```

## Phases

| Phase | Focus | Duration |
|---|---|---|
| Environment | CUDA, PyTorch, profiler | Week 1 |
| Operator / Kernel | Python call, dispatch, Triton/CUDA kernel | Week 1-2 |
| Inference System | Prefill/decode, KV cache, scheduler, streaming | Week 2-3 |
| Source Reading | vLLM / SGLang entry points, state, loops | Week 3-4 |
| Lab & PR | Benchmark, reproduction, first contribution | Week 4 |
