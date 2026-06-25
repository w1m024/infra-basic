# Inference System Overview

This chapter understands LLM inference from a system perspective, rather than starting from a specific framework command. The goal is to first establish the request lifecycle, then read the source code of vLLM, SGLang, TensorRT-LLM, TGI, DeepSeek infra and other projects.

## Request Lifecycle

```text
HTTP / native request
→ tokenizer / chat template
→ request admission / queue
→ prefill
→ KV cache allocation
→ decode loop
→ sampling / logits processing
→ streaming chunks
→ request finish / cache release
```

## Core System Modules

| Module | Responsibility | Typical Source Location |
|---|---|---|
| API layer | Parse OpenAI-compatible / native request, handle streaming | server / api / protocol |
| Request state | Store prompt, generation parameters, progress, output tokens | request / sequence / state |
| Scheduler | Decide which requests and how many tokens to process each step | scheduler / engine |
| KV cache manager | Allocate, reuse, release KV cache blocks | cache / block manager |
| Model runner | Form batch, prepare token ids, positions, metadata | worker / model_runner |
| Attention backend | Execute attention kernel, consume KV metadata | attention / backend / kernel |
| Sampler | temperature, top-p, top-k, grammar, structured output | sampler / logits processor |

## Learning Order

```text
Prefill / Decode
→ KV Cache System
→ Scheduler & Batching
→ Serving API & Streaming
→ Benchmark & Profiling
→ Distributed Inference
→ Production Serving
```

## Pass Criteria

You can draw the main path of a request in a serving engine, and explain what TTFT, TPOT, KV cache, scheduler, and attention backend each affect.
