# Distributed Inference

When a single GPU cannot meet model size, throughput, or latency SLO, distributed inference is needed. Don't start with multi-node deployment - first understand parallelism methods and communication bottlenecks.

## Parallelism Methods

| Method | Purpose | Typical Communication |
|---|---|---|
| Tensor Parallel | Split single-layer matrix computation | all-reduce |
| Pipeline Parallel | Split model by layers | point-to-point |
| Data Parallel | Multiple replicas handle different requests | load balancing |
| Expert Parallel | MoE experts distributed across GPUs | all-to-all |
| Context Parallel | Split long context | attention / KV communication |

## System Issues

- How to shard KV cache across multiple GPUs;
- How tensor parallel affects attention backend;
- How MoE dispatch / combine connects with GEMM;
- Whether NCCL / all-reduce / all-to-all becomes a bottleneck;
- Whether prefill and decode suit different resource pools;
- How cache transfer and network latency affect TTFT in multi-node setups.

## Representative Projects

- vLLM tensor parallel / distributed serving;
- SGLang data parallel / expert parallel;
- TensorRT-LLM multi-GPU / multi-node;
- DeepEP for MoE expert parallel communication;
- Dynamo for multi-node orchestration.

## Pass Criteria

You can explain what problems tensor parallel, pipeline parallel, and expert parallel each solve, and why they introduce communication costs.
