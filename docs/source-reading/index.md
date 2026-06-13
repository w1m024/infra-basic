# Source reading map

Source reading is anchored to the current vendor submodule checkouts. Every project is registered in `vendor/MANIFEST.yaml`.

## Reading order

1. Serving engines: request entrypoint, scheduler, KV cache, worker, streaming.
2. Kernel libraries: attention/GEMM/kernel backend input-output boundaries.
3. Distributed/cache: communication, cache, deployment, observability.
4. Agent runtime: terminal/IDE/cloud/research agent tool and verification loops.

## Project index

| Priority | Category | Project | Article | Local path |
|---|---|---|---|---|
| P0 | serving-engine | vLLM | [article](/source-reading/serving/vllm) | `vendor/vllm-project/vllm` |
| P0 | serving-engine | SGLang | [article](/source-reading/serving/sglang) | `vendor/sgl-project/sglang` |
| P1 | serving-engine | Text Generation Inference | [article](/source-reading/serving/tgi) | `vendor/huggingface/text-generation-inference` |
| P1 | serving-engine | LMDeploy | [article](/source-reading/serving/lmdeploy) | `vendor/InternLM/lmdeploy` |
| P1 | serving-engine | llama.cpp | [article](/source-reading/serving/llama-cpp-ggml) | `vendor/ggml-org/llama.cpp` |
| P1 | kernel-library | ggml | [article](/source-reading/serving/llama-cpp-ggml) | `vendor/ggml-org/ggml` |
| P1 | distributed-serving | Dynamo | [article](/source-reading/distributed/dynamo) | `vendor/ai-dynamo/dynamo` |
| P1 | distributed-serving | TensorRT-LLM Backend | [article](/source-reading/distributed/triton-server) | `vendor/triton-inference-server/tensorrtllm_backend` |
| P1 | distributed-serving | Triton Inference Server | [article](/source-reading/distributed/triton-server) | `vendor/triton-inference-server/server` |
| P0 | kernel-library | FlashInfer | [article](/source-reading/kernels/flashinfer) | `vendor/flashinfer-ai/flashinfer` |
| P0 | kernel-library | FlashAttention | [article](/source-reading/kernels/flash-attention) | `vendor/Dao-AILab/flash-attention` |
| P0 | kernel-library | CUTLASS | [article](/source-reading/kernels/cutlass) | `vendor/NVIDIA/cutlass` |
| P0 | serving-engine | TensorRT-LLM | [article](/source-reading/serving/tensorrt-llm) | `vendor/NVIDIA/TensorRT-LLM` |
| P0 | kernel-library | Triton | [article](/source-reading/kernels/triton) | `vendor/triton-lang/triton` |
| P0 | kernel-library | FlashMLA | [article](/source-reading/kernels/flashmla) | `vendor/deepseek-ai/FlashMLA` |
| P0 | kernel-library | DeepGEMM | [article](/source-reading/kernels/deepgemm) | `vendor/deepseek-ai/DeepGEMM` |
| P0 | distributed-serving | DeepEP | [article](/source-reading/distributed/deepep) | `vendor/deepseek-ai/DeepEP` |
| P1 | distributed-serving | 3FS | [article](/source-reading/distributed/3fs) | `vendor/deepseek-ai/3FS` |
| P1 | cache-system | LMCache | [article](/source-reading/distributed/lmcache) | `vendor/LMCache/LMCache` |
| P1 | structured-output | Outlines | [article](/source-reading/structured-output/outlines) | `vendor/dottxt-ai/outlines` |
| P1 | structured-output | Guidance | [article](/source-reading/structured-output/guidance) | `vendor/guidance-ai/guidance` |
| P2 | serving-engine | PaddleNLP | [article](/source-reading/serving/paddlenlp) | `vendor/PaddlePaddle/PaddleNLP` |
| P0 | agent-runtime | Codex | [article](/source-reading/agents/codex) | `vendor/openai/codex` |
| P1 | agent-runtime | Claude Code | [article](/source-reading/agents/claude-code) | `vendor/anthropics/claude-code` |
| P0 | agent-runtime | Gemini CLI | [article](/source-reading/agents/gemini-cli) | `vendor/google-gemini/gemini-cli` |
| P0 | agent-runtime | Aider | [article](/source-reading/agents/aider) | `vendor/aider-ai/aider` |
| P0 | agent-runtime | OpenHands | [article](/source-reading/agents/openhands) | `vendor/OpenHands/openhands` |
| P1 | ide-agent | Cline | [article](/source-reading/agents/cline-roo) | `vendor/cline/cline` |
| P1 | ide-agent | Roo Code | [article](/source-reading/agents/cline-roo) | `vendor/RooCodeInc/Roo-Code` |
| P2 | extension-reference | Roo Code Docs | [article](/source-reading/agents/cline-roo) | `vendor/RooCodeInc/Roo-Code-Docs` |
| P1 | agent-runtime | OpenCode | [article](/source-reading/agents/opencode-continue) | `vendor/anomalyco/opencode` |
| P1 | ide-agent | Continue | [article](/source-reading/agents/opencode-continue) | `vendor/continuedev/continue` |
| P0 | research-agent | SWE-agent | [article](/source-reading/agents/swe-agent) | `vendor/SWE-agent/SWE-agent` |
| P0 | research-agent | mini-swe-agent | [article](/source-reading/agents/swe-agent) | `vendor/SWE-agent/mini-swe-agent` |

## Check

```bash
npm run check:vendor
```
