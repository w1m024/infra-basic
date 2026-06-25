# 分布式推理

当单卡无法满足模型大小、吞吐或 latency SLO 时，需要进入分布式推理。不要一开始就多机部署，先理解并行方式和通信瓶颈。

## 并行方式

| 方式 | 作用 | 典型通信 |
|---|---|---|
| Tensor Parallel | 拆分单层矩阵计算 | all-reduce |
| Pipeline Parallel | 按层切分模型 | point-to-point |
| Data Parallel | 多副本处理不同请求 | load balancing |
| Expert Parallel | MoE expert 分布到不同 GPU | all-to-all |
| Context Parallel | 长上下文拆分 | attention / KV communication |

## 系统问题

- 多 GPU 下 KV cache 如何分片；
- tensor parallel 如何影响 attention backend；
- MoE dispatch / combine 如何与 GEMM 衔接；
- NCCL / all-reduce / all-to-all 是否成为瓶颈；
- prefill 和 decode 是否适合不同资源池；
- 多节点时 cache transfer 和 network latency 如何影响 TTFT。

## 代表项目

- vLLM tensor parallel / distributed serving；
- SGLang data parallel / expert parallel；
- TensorRT-LLM multi-GPU / multi-node；
- DeepEP for MoE expert parallel communication；
- Dynamo for multi-node orchestration。

## 通过标准

能解释 tensor parallel、pipeline parallel、expert parallel 分别解决什么问题，以及它们为什么会引入通信成本。
