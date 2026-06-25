# Bibliography & Resource Index

This document is the resource index version of the paper syllabus. It lists "what to read specifically".

This repository uses **CUDA-first / NVIDIA standard environment**. Resources are organized by priority:

```text
PyTorch CUDA / Profiler
→ CUDA / Nsight / Triton CUDA
→ vLLM / SGLang CUDA path
→ LLM serving papers
→ optional non-CUDA extensions
```

## 0. Official Documentation: CUDA-first Mainline

### PyTorch / Transformers / Triton CUDA

- PyTorch Tutorials: https://docs.pytorch.org/tutorials/
- PyTorch Profiler: https://docs.pytorch.org/docs/stable/profiler.html
- PyTorch Custom Operators: https://docs.pytorch.org/tutorials/advanced/custom_ops_landing_page.html
- Hugging Face Transformers Generation: https://huggingface.co/docs/transformers/main_classes/text_generation
- Triton Tutorials: https://triton-lang.org/main/getting-started/tutorials/

### CUDA / Profiling / Kernel Tools

- CUDA C++ Programming Guide: https://docs.nvidia.com/cuda/cuda-c-programming-guide/
- CUDA C++ Best Practices Guide: https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/
- Nsight Systems: https://developer.nvidia.com/nsight-systems
- Nsight Compute: https://developer.nvidia.com/nsight-compute
- CUTLASS: https://github.com/NVIDIA/cutlass

### vLLM

- vLLM Quickstart: https://docs.vllm.ai/en/latest/getting_started/quickstart.html
- vLLM Architecture Overview: https://docs.vllm.ai/en/latest/design/arch_overview.html
- vLLM GitHub: https://github.com/vllm-project/vllm

### SGLang

- SGLang Installation: https://docs.sglang.io/docs/get-started/install
- SGLang Basic Usage: https://docs.sglang.io/docs/basic_usage/overview
- SGLang GitHub: https://github.com/sgl-project/sglang

## 1. Foundation Papers: Models & Generation

| # | Paper | Link | Reading Focus |
|---:|---|---|---|
| 1 | Attention Is All You Need | https://arxiv.org/abs/1706.03762 | Transformer block, self-attention, position encoding |
| 2 | Language Models are Few-Shot Learners | https://arxiv.org/abs/2005.14165 | Autoregressive LM and prompting |
| 3 | Multi-Query Attention | https://arxiv.org/abs/1911.02150 | Why reducing KV heads reduces cache cost |
| 4 | RoFormer: Enhanced Transformer with Rotary Position Embedding | https://arxiv.org/abs/2104.09864 | RoPE and position encoding |

## 2. GPU / Attention / CUDA Kernel Basics

| # | Paper / Resource | Link | Reading Focus |
|---:|---|---|---|
| 1 | CUDA C++ Programming Guide | https://docs.nvidia.com/cuda/cuda-c-programming-guide/ | Programming model, thread/memory hierarchy |
| 2 | PyTorch Profiler | https://docs.pytorch.org/docs/stable/profiler.html | Learn to read ops, then write ops |
| 3 | Triton Tutorials | https://triton-lang.org/main/getting-started/tutorials/ | Vector add, matmul, softmax |
| 4 | FlashAttention | https://arxiv.org/abs/2205.14135 | IO-aware attention and HBM access |

## 3. LLM Serving Classic Papers

| # | Paper | Link | Reading Focus |
|---:|---|---|---|
| 1 | Orca | https://www.usenix.org/conference/osdi22/presentation/yu | Iteration-level scheduling / continuous batching |
| 2 | Efficient Memory Management with PagedAttention | https://arxiv.org/abs/2309.06180 | vLLM core idea; KV cache block management |
| 3 | SGLang | https://arxiv.org/abs/2312.07104 | RadixAttention, structured LM program |
| 4 | TensorRT-LLM | https://nvidia.github.io/TensorRT-LLM/ | High-performance inference backend reference |

## 4. Prefill / Decode / Scheduling

| # | Paper | Link | Reading Focus |
|---:|---|---|---|
| 1 | SARATHI | https://arxiv.org/abs/2308.16369 | Chunked prefill, decode-maximal batching |
| 2 | Splitwise | https://arxiv.org/abs/2311.18677 | Prefill/decode phase splitting |
| 3 | DistServe | https://arxiv.org/abs/2401.09670 | PD disaggregation |
| 4 | Mooncake | https://arxiv.org/abs/2407.00079 | KV cache-centric scheduler |

## 5. KV Cache / Prefix Cache

| # | Paper / System | Link | Reading Focus |
|---:|---|---|---|
| 1 | PagedAttention | https://arxiv.org/abs/2309.06180 | Paged KV cache, fragmentation |
| 2 | SGLang / RadixAttention | https://arxiv.org/abs/2312.07104 | Radix tree prefix reuse |
| 3 | LMCache | https://github.com/LMCache/LMCache | KV cache offload |

## 6. Speculative Decoding

| # | Paper | Link | Reading Focus |
|---:|---|---|---|
| 1 | Speculative Decoding | https://arxiv.org/abs/2211.17192 | Draft model, verify, acceptance rate |
| 2 | SpecInfer | https://arxiv.org/abs/2305.09781 | Tree-based speculative inference |
| 3 | EAGLE | https://arxiv.org/abs/2401.15077 | Feature-level speculative sampling |

## 7. Quantization / Low Precision

| # | Paper | Link | Reading Focus |
|---:|---|---|---|
| 1 | SmoothQuant | https://arxiv.org/abs/2211.10438 | Activation/weight quantization balance |
| 2 | GPTQ | https://arxiv.org/abs/2210.17323 | Post-training weight-only quantization |
| 3 | AWQ | https://arxiv.org/abs/2306.00978 | Activation-aware weight quantization |

## 8. Reading Priority Compressed

When time is limited, read these 12 first:

1. CUDA C++ Programming Guide
2. PyTorch Profiler
3. Triton Tutorials
4. FlashAttention
5. Orca
6. PagedAttention / vLLM
7. SGLang
8. SARATHI
9. DistServe
10. Mooncake
11. Speculative Decoding
12. SmoothQuant or GPTQ
