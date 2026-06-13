# 06. Bibliography and Resource Index

本文档是 `docs/01-paper-syllabus.md` 的资源索引版。`01-paper-syllabus` 说明“为什么读、怎么读”，本文档列出“具体读哪些”。

本仓库采用 **CUDA-first / NVIDIA 标准环境**。资源优先级按下面顺序组织：

```text
PyTorch CUDA / Profiler
→ CUDA / Nsight / Triton CUDA
→ vLLM / SGLang CUDA path
→ LLM serving papers
→ optional non-CUDA extensions
```

## 0. 官方文档：CUDA-first 主线

### PyTorch / Transformers / Triton CUDA

- PyTorch Tutorials: https://docs.pytorch.org/tutorials/
- PyTorch Profiler: https://docs.pytorch.org/docs/stable/profiler.html
- PyTorch Custom Operators Landing Page: https://docs.pytorch.org/tutorials/advanced/custom_ops_landing_page.html
- PyTorch Custom C++ / CUDA Operators: https://docs.pytorch.org/tutorials/advanced/cpp_custom_ops.html
- PyTorch `torch.library`: https://docs.pytorch.org/docs/stable/library.html
- Hugging Face Transformers Generation: https://huggingface.co/docs/transformers/main_classes/text_generation
- Hugging Face KV Cache: https://huggingface.co/docs/transformers/kv_cache
- Triton Tutorials: https://triton-lang.org/main/getting-started/tutorials/
- Triton Matmul Tutorial: https://triton-lang.org/main/getting-started/tutorials/03-matrix-multiplication.html
- Triton Language API: https://triton-lang.org/main/python-api/triton.language.html

### CUDA / Profiling / Kernel Tools

- CUDA C++ Programming Guide: https://docs.nvidia.com/cuda/cuda-c-programming-guide/
- CUDA C++ Best Practices Guide: https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/
- Nsight Systems: https://developer.nvidia.com/nsight-systems
- Nsight Compute: https://developer.nvidia.com/nsight-compute
- CUTLASS: https://github.com/NVIDIA/cutlass
- CuTe DSL: https://docs.nvidia.com/cutlass/media/docs/cpp/cute/index.html

### vLLM

- vLLM Quickstart: https://docs.vllm.ai/en/latest/getting_started/quickstart.html
- vLLM Architecture Overview: https://docs.vllm.ai/en/latest/design/arch_overview.html
- vLLM V1 Guide: https://docs.vllm.ai/en/latest/usage/v1_guide.html
- vLLM Benchmark CLI: https://docs.vllm.ai/en/latest/benchmarking/benchmark_cli.html
- vLLM Attention Backends: https://docs.vllm.ai/en/latest/design/attention_backends.html
- vLLM GitHub: https://github.com/vllm-project/vllm

### SGLang

- SGLang Installation: https://docs.sglang.io/docs/get-started/install
- SGLang Basic Usage: https://docs.sglang.io/docs/basic_usage/overview
- SGLang OpenAI-compatible APIs: https://docs.sglang.io/docs/basic_usage/openai_api
- SGLang Offline Engine API: https://docs.sglang.io/docs/basic_usage/offline_engine_api
- SGLang Native APIs: https://docs.sglang.io/docs/basic_usage/native_api
- SGLang Structured Outputs: https://docs.sglang.io/docs/advanced_features/structured_outputs
- SGLang GitHub: https://github.com/sgl-project/sglang

## 1. 基础论文：模型与生成

| 顺序 | 论文 | 链接 | 读法 |
|---:|---|---|---|
| 1 | Attention Is All You Need | https://arxiv.org/abs/1706.03762 | 只抓 Transformer block、self-attention、position encoding |
| 2 | Language Models are Few-Shot Learners | https://arxiv.org/abs/2005.14165 | 理解 autoregressive LM 与 prompting |
| 3 | Multi-Query Attention | https://arxiv.org/abs/1911.02150 | 理解减少 KV heads 为什么能降低 cache 成本 |
| 4 | Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints | https://arxiv.org/abs/2305.13245 | 理解 GQA/MQA 与 serving 的关系 |
| 5 | RoFormer: Enhanced Transformer with Rotary Position Embedding | https://arxiv.org/abs/2104.09864 | 理解 RoPE 与位置编码 |

## 2. GPU / Attention / CUDA Kernel 基础

| 顺序 | 论文 / 资料 | 链接 | 读法 |
|---:|---|---|---|
| 1 | CUDA C++ Programming Guide | https://docs.nvidia.com/cuda/cuda-c-programming-guide/ | 只看 programming model、thread hierarchy、memory hierarchy、async execution |
| 2 | CUDA C++ Best Practices Guide | https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/ | 只看 memory access、occupancy、profiling |
| 3 | PyTorch Profiler | https://docs.pytorch.org/docs/stable/profiler.html | 先学会看 op，再写 op |
| 4 | Triton Tutorials | https://triton-lang.org/main/getting-started/tutorials/ | 从 vector add、matmul、softmax 开始 |
| 5 | FlashAttention | https://arxiv.org/abs/2205.14135 | 重点看 IO-aware attention 和 HBM 访问 |
| 6 | FlashAttention-2 | https://arxiv.org/abs/2307.08691 | 重点看并行度和 work partitioning |
| 7 | FlashAttention-3 | https://arxiv.org/abs/2407.08608 | 作为 Hopper / FP8 / 异步能力的前沿资料 |
| 8 | CUTLASS / CuTe | https://github.com/NVIDIA/cutlass | 高阶 GEMM / tensor core / tiling 学习资料 |

## 3. LLM Serving 经典论文

| 顺序 | 论文 | 链接 | 读法 |
|---:|---|---|---|
| 1 | Orca: A Distributed Serving System for Transformer-Based Generative Models | https://www.usenix.org/conference/osdi22/presentation/yu | iteration-level scheduling / continuous batching |
| 2 | Efficient Memory Management for Large Language Model Serving with PagedAttention | https://arxiv.org/abs/2309.06180 | vLLM 核心思想；KV cache block 管理 |
| 3 | SGLang: Efficient Execution of Structured Language Model Programs | https://arxiv.org/abs/2312.07104 | RadixAttention、structured LM program、compressed FSM |
| 4 | TensorRT-LLM documentation | https://nvidia.github.io/TensorRT-LLM/ | 高性能推理后端参考 |
| 5 | Hugging Face Text Generation Inference | https://github.com/huggingface/text-generation-inference | 生产 serving 系统参考 |

## 4. Prefill / Decode / Scheduling / Disaggregation

| 顺序 | 论文 | 链接 | 读法 |
|---:|---|---|---|
| 1 | SARATHI: Efficient LLM Inference by Piggybacking Decodes with Chunked Prefills | https://arxiv.org/abs/2308.16369 | chunked prefill、decode-maximal batching |
| 2 | Splitwise: Efficient generative LLM inference using phase splitting | https://arxiv.org/abs/2311.18677 | prefill/decode phase splitting 与异构资源 |
| 3 | DistServe: Disaggregating Prefill and Decoding for Goodput-optimized LLM Serving | https://arxiv.org/abs/2401.09670 | TTFT/TPOT SLO 下的 PD disaggregation |
| 4 | Mooncake: A KVCache-centric Disaggregated Architecture for LLM Serving | https://arxiv.org/abs/2407.00079 | KV cache-centric scheduler 与长上下文 serving |

## 5. KV Cache / Prefix Cache / Cache Offload

| 顺序 | 论文 / 系统 | 链接 | 读法 |
|---:|---|---|---|
| 1 | PagedAttention | https://arxiv.org/abs/2309.06180 | paged KV cache、fragmentation、copy-on-write |
| 2 | SGLang / RadixAttention | https://arxiv.org/abs/2312.07104 | radix tree prefix reuse |
| 3 | LMCache | https://github.com/LMCache/LMCache | KV cache offload、跨 engine cache reuse |
| 4 | Mooncake | https://arxiv.org/abs/2407.00079 | disaggregated KV cache |
| 5 | Comparative Characterization of KV Cache Management Strategies for LLM Inference | https://arxiv.org/abs/2604.05012 | 前沿综述/实证比较，适合后期读 |

## 6. Speculative Decoding / Multi-token Prediction

| 顺序 | 论文 | 链接 | 读法 |
|---:|---|---|---|
| 1 | Fast Inference from Transformers via Speculative Decoding | https://arxiv.org/abs/2211.17192 | draft model、verify、acceptance rate |
| 2 | SpecInfer | https://arxiv.org/abs/2305.09781 | tree-based speculative inference |
| 3 | Medusa | https://arxiv.org/abs/2401.10774 | 多 decoding heads |
| 4 | EAGLE | https://arxiv.org/abs/2401.15077 | feature-level speculative sampling |
| 5 | Lookahead Decoding | https://arxiv.org/abs/2402.02057 | 无 draft model 的多 token 思路 |

## 7. Quantization / Low Precision

| 顺序 | 论文 | 链接 | 读法 |
|---:|---|---|---|
| 1 | SmoothQuant | https://arxiv.org/abs/2211.10438 | activation/weight quantization 平衡 |
| 2 | GPTQ | https://arxiv.org/abs/2210.17323 | post-training weight-only quantization |
| 3 | AWQ | https://arxiv.org/abs/2306.00978 | activation-aware weight quantization |
| 4 | FP8-LM | https://arxiv.org/abs/2310.18313 | FP8 低精度训练/推理背景 |
| 5 | QServe | https://arxiv.org/abs/2405.04532 | W4A8KV4 serving 系统方向 |

## 8. Structured Output / Constrained Decoding

| 顺序 | 资料 | 链接 | 读法 |
|---:|---|---|---|
| 1 | SGLang paper | https://arxiv.org/abs/2312.07104 | compressed FSM、JSON decoding |
| 2 | SGLang Structured Outputs docs | https://docs.sglang.io/docs/advanced_features/structured_outputs | JSON schema / regex / EBNF 实践 |
| 3 | Outlines | https://github.com/dottxt-ai/outlines | grammar / schema 约束生成参考 |
| 4 | Guidance | https://github.com/guidance-ai/guidance | constrained generation 框架参考 |
| 5 | LMQL | https://arxiv.org/abs/2212.06094 | language model query / constrained decoding 思路 |

## 9. Operator / Kernel / Custom Op 实践资料

| 顺序 | 资料 | 链接 | 读法 |
|---:|---|---|---|
| 1 | PyTorch Custom Operators Landing Page | https://docs.pytorch.org/tutorials/advanced/custom_ops_landing_page.html | 理解 custom op 的完整路径 |
| 2 | PyTorch Custom C++ / CUDA Operators | https://docs.pytorch.org/tutorials/advanced/cpp_custom_ops.html | 学习 C++/CUDA 接入 PyTorch |
| 3 | PyTorch `torch.library` | https://docs.pytorch.org/docs/stable/library.html | 理解 Python 侧注册 custom op |
| 4 | vLLM Attention Backends | https://docs.vllm.ai/en/latest/design/attention_backends.html | 理解 serving runtime 和 attention kernel 的连接 |
| 5 | Nsight Systems | https://developer.nvidia.com/nsight-systems | 系统级 timeline profiling |
| 6 | Nsight Compute | https://developer.nvidia.com/nsight-compute | 单 kernel 深度分析 |

## 10. Optional non-CUDA extensions

这些内容不作为本仓库主线，只作为了解不同硬件/框架生态时的对照材料。

| 方向 | 资料 | 链接 | 读法 |
|---|---|---|---|
| Paddle Custom C++ Op | PaddlePaddle Custom C++ Op | https://www.paddlepaddle.org.cn/documentation/guides/custom_op/new_cpp_op_cn.html | 对照 PyTorch custom op |
| Paddle Custom Kernel | PaddlePaddle Custom Kernel | https://www.paddlepaddle.org.cn/documentation/docs/en/dev_guides/custom_device_docs/custom_kernel_en.html | 了解 custom device / non-CUDA backend |
| Paddle Custom Device | PaddlePaddle Custom Device | https://www.paddlepaddle.org.cn/documentation/docs/en/dev_guides/custom_device_docs/custom_device_overview_en.html | 了解外部设备接入 |
| PaddleNLP | PaddleNLP | https://github.com/PaddlePaddle/PaddleNLP | 国产框架生态扩展 |

## 11. 2025-2026 前沿观察清单

这些不一定适合入门阶段精读，但适合后期跟踪方向。

| 方向 | 代表资料 | 链接 | 为什么关注 |
|---|---|---|---|
| KV cache as system layer | LMCache | https://github.com/LMCache/LMCache | vLLM/SGLang 之外的 cache orchestration |
| KV cache 管理比较 | Comparative Characterization of KV Cache Management Strategies | https://arxiv.org/abs/2604.05012 | 比较不同 cache 策略的 trade-off |
| 多模态 serving | vLLM-Omni | https://arxiv.org/abs/2602.02204 | any-to-any multimodal serving 的系统方向 |
| PD disaggregation 实践 | vLLM disaggregated serving docs | https://docs.vllm.ai/en/latest/examples/disaggregated_serving.html | 生产 serving 的重要趋势 |
| SGLang 高级功能 | PD/EPD disaggregation、HiCache、DP router | https://docs.sglang.io/docs/basic_usage/overview | SGLang 的高级系统能力 |

## 12. 阅读优先级压缩版

时间有限时，先读这 12 个：

1. CUDA C++ Programming Guide: programming model / memory hierarchy only
2. PyTorch Profiler / Tensor layout 基础
3. Triton Tutorials: vector add / matmul / softmax
4. FlashAttention
5. Orca
6. PagedAttention / vLLM
7. SGLang
8. SARATHI
9. DistServe
10. Mooncake
11. Speculative Decoding
12. SmoothQuant 或 GPTQ

## 13. 不建议新手过早深挖的内容

- CUDA C++ kernel 完整实现；
- CUTLASS / CuTe 高性能 GEMM；
- NCCL 多机通信细节；
- Kubernetes 大规模部署；
- MoE expert parallelism；
- 多模态 any-to-any serving；
- vLLM/SGLang 最新 experimental 分布式功能。

这些主题不是不重要，而是需要在掌握 PyTorch CUDA tensor、operator/kernel、CUDA/GPU 编程模型、prefill/decode、KV cache、scheduler、benchmark 之后再进入。