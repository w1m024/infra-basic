# 环境与 CUDA 路线

本仓库默认主线是 NVIDIA CUDA 路径：

```text
Linux
→ NVIDIA GPU
→ NVIDIA Driver
→ CUDA Toolkit
→ PyTorch CUDA
→ Triton CUDA
→ vLLM / SGLang CUDA path
```

## 最小检查

```bash
nvidia-smi
python -c "import torch; print(torch.cuda.is_available()); print(torch.version.cuda)"
```

## 学习重点

- tensor shape、dtype、device、contiguous 与显存占用。
- profiler 中 CPU 调用、operator、kernel 的关系。
- batch size、sequence length、KV cache 对显存和延迟的影响。

## 下一步

- [Operator / Kernel 实验](/labs/p1-operator-kernel)
- [Benchmark & Profiling](/systems/benchmark-profiling)
