# 开源库全景

本章整理 LLM 推理基础设施方向最值得学习的开源项目。选择标准不是“部署最省事”，而是项目是否能帮助理解 serving runtime、KV cache、scheduler、kernel、通信、分布式编排和硬件优化。

## 分层总览

| 层级 | 代表项目 | 适合学习的问题 |
|---|---|---|
| Serving engine | vLLM、SGLang、TensorRT-LLM、TGI、LMDeploy | 请求调度、continuous batching、KV cache、OpenAI-compatible server、benchmark |
| Local / edge runtime | llama.cpp / ggml、Ollama | 量化、CPU / GPU portable backend、本地推理、GGUF 模型格式 |
| Kernel / operator | FlashAttention、FlashInfer、FlashMLA、DeepGEMM、CUTLASS、Triton | attention kernel、GEMM、FP8、MoE kernel、memory bandwidth、tensor core |
| Communication / MoE | DeepEP、NCCL、Megatron-Core | all-to-all、expert parallel、MoE dispatch / combine、overlap communication |
| Distributed serving | NVIDIA Dynamo、Triton Inference Server、Ray Serve、KServe | routing、PD disaggregation、multi-node serving、autoscaling、observability |
| Model-specific infra | DeepSeek-V3 / R1 / V3.2 infra stack | MLA、MoE、FP8、sparse attention、large-scale inference path |

## 第一优先级

| 项目 | 官方入口 | 为什么值得学 |
|---|---|---|
| vLLM | https://github.com/vllm-project/vllm | 通用 LLM serving engine，重点是 scheduler、PagedAttention、KV cache manager、model runner |
| SGLang | https://github.com/sgl-project/sglang | 复杂 generation program runtime，重点是 radix cache、structured output、runtime scheduler |
| DeepSeek infra stack | https://github.com/deepseek-ai | 近年最值得拆的模型系统协同案例，覆盖 MLA、FP8 GEMM、MoE 通信和 AI workload filesystem |
| TensorRT-LLM | https://github.com/NVIDIA/TensorRT-LLM | NVIDIA 官方高性能推理栈，适合学 custom kernels、engine build、runtime optimization、PD disaggregation |
| TGI | https://github.com/huggingface/text-generation-inference | Hugging Face 生产 serving 栈，Rust / Python / gRPC 架构适合对比 vLLM |
| llama.cpp / ggml | https://github.com/ggml-org/llama.cpp | 本地和边缘推理核心项目，适合学习量化、portable backend、低依赖 runtime |

## 第二优先级

| 项目 | 官方入口 | 为什么值得学 |
|---|---|---|
| LMDeploy | https://github.com/InternLM/lmdeploy | 压缩、部署和 serving 一体化，TurboMind、blocked KV cache、persistent batching 值得对比 |
| NVIDIA Dynamo | https://github.com/ai-dynamo/dynamo | 数据中心级分布式推理编排层，强调 routing、KV cache、PD disaggregation 和多节点协调 |
| Triton Inference Server / TensorRT-LLM Backend | https://github.com/triton-inference-server/tensorrtllm_backend | 生产 serving 后端、inflight batching、Triton backend interface |
| FlashInfer | https://github.com/flashinfer-ai/flashinfer | LLM serving attention / sampling kernels，适合连接 vLLM/SGLang backend |
| FlashAttention | https://github.com/Dao-AILab/flash-attention | IO-aware attention 的经典实现，适合建立 attention kernel 直觉 |
| CUTLASS / CuTe | https://github.com/NVIDIA/cutlass | NVIDIA GEMM / tensor core / tiling / CuTe DSL 的长期深入方向 |

## 推荐阅读顺序

```text
vLLM / SGLang
→ TensorRT-LLM / TGI / LMDeploy
→ llama.cpp / ggml
→ FlashAttention / FlashInfer / DeepSeek FlashMLA
→ DeepGEMM / DeepEP / CUTLASS
→ Dynamo / Triton Server / Ray Serve / KServe
```

先读 serving engine，建立请求路径和调度直觉；再读 kernel / communication，理解性能来自哪里；最后读分布式编排，理解多机生产系统如何组织资源。

## 横向比较维度

1. 请求入口：OpenAI-compatible、native API、offline inference；
2. 调度：continuous batching、chunked prefill、PD disaggregation、priority；
3. KV cache：paged / blocked / radix / offload / multi-tier；
4. Attention backend：FlashAttention、FlashInfer、Triton、CUDA custom kernel；
5. MoE：expert parallel、dispatch / combine、all-to-all、load balance；
6. Quantization：FP8、INT8、INT4、AWQ、GPTQ、GGUF；
7. 多 GPU：tensor parallel、pipeline parallel、data parallel、NCCL；
8. 部署形态：single node、multi-node、Kubernetes、serverless、edge。
