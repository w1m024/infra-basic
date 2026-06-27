# 实验项目

实验项目用于把概念、源码和可观测指标连接起来。每个实验都应记录环境、命令、输入、输出、指标和结论。

## 实验与阶段对应

| 实验 | 对应阶段 | 目标 | 通过标准 |
|---|---|---|---|
| [PyTorch CUDA](./torch-cuda.md) | 阶段 0-1 | 跑通 CUDA tensor 和小模型推理 | 有环境、脚本、显存记录 |
| [Transformers 手写生成](./transformers-generation.md) | 阶段 2 | naive/KV cache decoding、sampling、prefill/decode | 有耗时对比表 |
| [Toy Serving](./toy-serving.md) | 阶段 3 | 搭建最小 streaming server | 有压测记录 |
| [vLLM](./vllm.md) | 阶段 6 | 跑通 vLLM 最小服务 | 有 TTFT/TPOT 记录 |
| [SGLang](./sglang.md) | 阶段 7 | 跑通 SGLang 最小服务 | 有 TTFT/TPOT 记录 |
| [第一个 PR](./first-pr.md) | 贯穿线 B | 准备第一个开源贡献 | 有 reproduction 或 patch |

## 前置阅读（阶段 4-5）

- [Operator / Kernel 入门](/reference/operator-kernel-guide)
- [CUDA GPU 入门](/reference/cuda-gpu-guide)
