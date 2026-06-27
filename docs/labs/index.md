# 实验项目

实验项目用于把概念、源码和可观测指标连接起来。每个实验都应记录环境、命令、输入、输出、指标和结论。

## 前置阅读

- [Operator / Kernel 入门](/reference/operator-kernel-guide)
- [CUDA GPU 入门](/reference/cuda-gpu-guide)

## 实验列表

| 实验 | 目标 | 通过标准 |
|---|---|---|
| [P0 PyTorch CUDA](./p0-torch-cuda.md) | 跑通 CUDA tensor 和小模型推理 | 有环境、脚本、显存记录 |
| [P5 Toy Serving](./p5-toy-serving.md) | 搭建最小 streaming server | 有压测记录 |
| [P6 vLLM](./p6-vllm.md) | 跑通 vLLM 最小服务 | 有 TTFT/TPOT 记录 |
| [P7 SGLang](./p7-sglang.md) | 跑通 SGLang 最小服务 | 有 TTFT/TPOT 记录 |
| [P9 First PR](./p9-first-pr.md) | 准备第一个开源贡献 | 有 reproduction 或 patch |
