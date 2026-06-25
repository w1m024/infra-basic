# Source Reading Map

Source reading is anchored to the current vendor submodule checkouts. Every project is registered in `vendor/MANIFEST.yaml`.

## Reading Order

1. Serving engines: request entrypoint, scheduler, KV cache, worker, streaming.
2. Kernel libraries: attention/GEMM/kernel backend input-output boundaries.
3. Distributed/cache: communication, cache, deployment, observability.
4. Agent runtime: terminal/IDE/cloud/research agent tool and verification loops.

## Projects

- **Serving**: vLLM, SGLang, TensorRT-LLM, TGI, LMDeploy, llama.cpp
- **Kernels**: FlashInfer, FlashAttention, CUTLASS, Triton, FlashMLA, DeepGEMM
- **Distributed**: Dynamo, Triton Server, DeepEP, 3FS, LMCache
- **Agents**: Codex, Claude Code, Gemini CLI, Aider, OpenHands, SWE-agent

> Full English source reading articles are coming soon.
