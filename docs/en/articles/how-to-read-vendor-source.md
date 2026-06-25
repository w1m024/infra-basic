# How to Read Vendor Source

`vendor/` is not a collection. Its purpose is to anchor source reading articles to a reproducible checkout: paths, commits, entry files, and experiment commands must all be traceable back to local submodules.

## Reading Order

1. Serving: Start with vLLM, SGLang, TensorRT-LLM to establish the mainline of request entry, scheduler, KV cache, worker, streaming.
2. Kernel: Then read FlashInfer, FlashAttention, CUTLASS, Triton to understand the boundary where serving engines call backends.
3. Distributed: Add DeepEP, Triton Server, Dynamo, LMCache, focusing on communication, cache, deployment, and observability.
4. Agent: Finally read Codex, Gemini CLI, Aider, OpenHands, SWE-agent, comparing tool loops, sandbox, edit, and verification.

## Fixed Method

Read each project using the same table:

| Dimension | Question |
|---|---|
| Entry | Where does the request, command, or API enter? |
| State | Who creates request/cache/runtime/tool state? |
| Loop | How do schedule/execute/stream or model/tool/verify loop? |
| Resources | How are cache, GPU memory, process, sandbox released? |
| Boundary | Which parts are backend, driver, external service, or model responsibility? |
| Metrics | Where are TTFT, TPOT, tokens/s, trace, trajectory recorded? |

## Recording Commits and Paths

```bash
git submodule update --init --depth 1 vendor/vllm-project/vllm
git -C vendor/vllm-project/vllm rev-parse --short HEAD
```

Source paths in articles must come from the current checkout. When paths change, fix the article first, then update the manifest.

## Avoid Getting Lost in Details

Don't start from kernel internals or the type system. First draw the main path diagram, then add key state objects, and only then read optimization branches.
