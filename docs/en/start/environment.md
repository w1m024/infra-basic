# Environment & CUDA Path

This repository's default mainline is the NVIDIA CUDA path:

```text
Linux
→ NVIDIA GPU
→ NVIDIA Driver
→ CUDA Toolkit
→ PyTorch CUDA
→ Triton CUDA
→ vLLM / SGLang CUDA path
```

## Minimal Check

```bash
nvidia-smi
python -c "import torch; print(torch.cuda.is_available()); print(torch.version.cuda)"
```

## Learning Focus

- Tensor shape, dtype, device, contiguous and memory usage.
- Relationship between CPU calls, operators, and kernels in profiler.
- Impact of batch size, sequence length, KV cache on memory and latency.

## Next Steps

- [Benchmark & Profiling](/en/systems/benchmark-profiling)
