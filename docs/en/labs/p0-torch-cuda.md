# P0 PyTorch CUDA Lab

## Goal

Verify that the machine can run NVIDIA CUDA path, and record a minimal inference experiment.

## Commands

```bash
nvidia-smi
python -c "import torch; print(torch.cuda.is_available()); print(torch.cuda.get_device_name(0))"
```

## Output

- GPU model, driver, CUDA version.
- Whether PyTorch CUDA is available.
- Memory record of a small model or tensor operation.

## Pass Criteria

You can explain the difference when a tensor is on CPU vs GPU, and record the peak memory of one inference.
