# P0 PyTorch CUDA

## 目标

确认本机能走 NVIDIA CUDA 路径，并记录最小推理实验。

## 命令

```bash
nvidia-smi
python -c "import torch; print(torch.cuda.is_available()); print(torch.cuda.get_device_name(0))"
```

## 输出

- GPU 型号、driver、CUDA 版本。
- PyTorch CUDA 是否可用。
- 一个小模型或 tensor 运算的显存记录。

## 通过标准

能解释 tensor 位于 CPU/GPU 时的差异，并记录一次推理的显存峰值。
