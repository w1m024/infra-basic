# vLLM Study Plan

This document provides a specialized learning plan for vLLM. The goal is to gradually progress from "being able to start vLLM" to "being able to locate code, reproduce issues, run benchmarks, and submit small PRs".

## Learning Objectives

After completing this plan, you should be able to:

1. Start vLLM offline inference and OpenAI-compatible server;
2. Explain the main path of requests in vLLM;
3. Understand the responsibilities of scheduler, KV cache manager, model runner, and attention backend;
4. Design basic benchmarks and interpret results;
5. Reproduce issues and submit documentation, tests, benchmark, or small feature PRs.

## Official Documentation Entry Points

Prioritize official documentation and source code:

- Quickstart: https://docs.vllm.ai/en/latest/getting_started/quickstart.html
- Architecture Overview: https://docs.vllm.ai/en/latest/design/arch_overview.html
- V1 Guide: https://docs.vllm.ai/en/latest/usage/v1_guide.html
- Scheduler API docs: https://docs.vllm.ai/en/latest/api/vllm/v1/core/sched/scheduler.html
- GitHub: https://github.com/vllm-project/vllm

## Part 1: Get It Running, Without Reading Source Code

### Experiment 1: Offline batched inference

Goal: Understand that vLLM doesn't necessarily need an HTTP server and can perform offline batch inference directly.

Things to observe:

- Input batch size;
- Output token count;
- Time to load the model initially;
- Generation phase duration;
- GPU memory usage.

Deliverables:

```text
vllm_labs/offline_inference.py
vllm_labs/logs/offline_inference.md
```

### Experiment 2: OpenAI-compatible server

Goal: Understand the basic usage of vLLM as a server.

Startup example:

```bash
vllm serve Qwen/Qwen2.5-1.5B-Instruct \
  --host 0.0.0.0 \
  --port 8000
```

Client:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="EMPTY",
)

resp = client.chat.completions.create(
    model="Qwen/Qwen2.5-1.5B-Instruct",
    messages=[{"role": "user", "content": "Explain KV cache in one paragraph."}],
)
print(resp.choices[0].message.content)
```

Deliverables:

```text
vllm_labs/run_server.sh
vllm_labs/client_openai.py
```

### Experiment 3: Streaming

Goal: Understand the difference between token streaming and non-streaming responses.

Things to record:

- Time to first chunk arrival;
- Total completion time;
- Average token interval.

Deliverables:

```text
vllm_labs/client_streaming.py
vllm_labs/streaming_notes.md
```

## Part 2: Parameter Experiments

### Parameter 1: `--max-model-len`

Things to observe:

- How the KV cache budget changes with larger max context;
- What errors occur when memory is insufficient;
- Why you shouldn't blindly increase it if your workload doesn't require long context.

Experiment table:

| max_model_len | idle memory | max concurrency | TTFT | output tokens/s | notes |
|---|---:|---:|---:|---:|---|
| 2048 | | | | | |
| 4096 | | | | | |
| 8192 | | | | | |

### Parameter 2: `--gpu-memory-utilization`

Things to observe:

- Too low: available KV cache is small, concurrency capability decreases;
- Too high: prone to OOM, leaves insufficient space for temporary buffers, CUDA graphs, and other processes;
- Production configuration needs to be tuned based on model, context, concurrency, and GPU memory.

### Parameter 3: `--max-num-batched-tokens`

Things to observe:

- It affects how many tokens can be processed per scheduling round;
- Different impacts on prefill-heavy workload versus decode-heavy workload;
- Overly large values aren't always better, potentially causing TTFT to increase.

### Parameter 4: Prefix caching

Things to observe:

- Same system prompt;
- RAG template fixed but different documents;
- Multi-turn conversation prefix gradually growing;
- Impact of cache hit versus miss on TTFT.

## Part 3: Benchmark Design

Don't just test one prompt. Construct at least 4 types of workloads:

| workload | characteristics | purpose |
|---|---|---|
| short-short | Short prompt, short output | Basic latency |
| short-long | Short prompt, long output | Decode throughput |
| long-short | Long prompt, short output | Prefill / TTFT |
| long-long | Long prompt, long output | Combined stress |

Recommended fixed variables:

- Model name;
- vLLM commit / version;
- GPU model;
- CUDA / driver;
- Startup parameters;
- Concurrency;
- Prompt token distribution;
- Output token distribution;
- Whether streaming;
- Whether prefix caching.

Deliverables:

```text
vllm_labs/benchmark_serving.sh
vllm_labs/benchmark_report.md
```

Report template:

```text
Model:
GPU:
vLLM version / commit:
Command:
Dataset / prompts:
Concurrency:
Metrics:
Observation:
Bottleneck guess:
Next experiment:
```

## Part 4: Source Code Reading Order

Don't start with CUDA kernels. Follow the request path.

### 1. Entrypoints

Goal: Know where `vllm serve` and Python `LLM` enter respectively.

Questions to answer:

- What are the entry points for online serving and offline inference respectively;
- How does the OpenAI-compatible API connect to the engine;
- How streaming responses are returned.

### 2. Engine

Goal: Understand that the engine is the bridge between the API layer and the underlying execution layer.

Questions to answer:

- How requests enter the engine;
- How request state is maintained;
- What an engine step is;
- What are the differences between async engine and sync engine.

### 3. Scheduler

Goal: Understand why the core of a serving system is not HTTP, but scheduling.

Questions to answer:

- How waiting / running requests transition;
- How many tokens are scheduled per step;
- How prefill and decode are organized;
- How chunked prefill avoids blocking on long prompts;
- What extra processing the scheduler needs for speculative decoding.

### 4. KV Cache Manager

Goal: Understand where PagedAttention lands in engineering practice.

Questions to answer:

- What is block size;
- How free blocks are managed;
- How to release after a request ends;
- How prefix caching looks up already computed tokens;
- In what scenarios copy-on-write or shared blocks appear.

### 5. Model Runner

Goal: Understand where the model forward pass is actually invoked.

Questions to answer:

- How the input batch is assembled;
- How token ids, positions, and KV cache metadata are passed in;
- How logits are returned;
- Where the sampler operates.

### 6. Attention Backend

Goal: Know where the kernel/backend fits in the system, rather than diving deep into writing kernels immediately.

Questions to answer:

- How the backend is selected;
- How paged attention metadata is passed to the backend;
- The general roles of FlashAttention / FlashInfer / Triton backends;
- In what situations a backend doesn't support a particular model or dtype.

## Part 5: Core Concepts Checklist

When learning vLLM, you must be able to explain:

- PagedAttention
- Continuous batching
- Prefill / decode
- Chunked prefill
- Paged KV cache
- Prefix caching
- Speculative decoding
- Tensor parallel
- Pipeline parallel
- Quantization
- OpenAI-compatible server
- Streaming
- Benchmark serving

## Part 6: Contribution Entry Points for Beginners

### Entry 1: Documentation PR

Suitable for fixing:

- Outdated commands;
- Changed parameter names;
- Unavailable example models;
- Documentation inconsistent with actual behavior;
- Missing benchmark instructions.

### Entry 2: Example PR

Suitable for adding:

- A minimal OpenAI client example;
- A streaming example;
- A prefix caching example;
- Deployment instructions for a specific model.

### Entry 3: Issue reproduction

Process:

```text
Find issue
→ Confirm version and hardware
→ Write minimal reproduction script
→ Record startup command, logs, errors
→ Determine if it's an environment, model, parameter, or code issue
→ Reply to issue or submit PR
```

### Entry 4: Benchmark reproduction

Suitable for:

- Reproducing official benchmarks;
- Comparing two commits;
- Comparing two parameters;
- Comparing two workloads.

Don't start by tackling:

- Major scheduler changes;
- Major KV cache manager changes;
- CUDA/Triton kernels;
- Multi-machine distributed systems;
- Large PRs involving multiple hardware backends.

## Part 7: Common Issues

### Issue: OOM immediately on startup

Priority checks:

1. Is the model too large;
2. Is `max_model_len` too large;
3. Is `gpu_memory_utilization` too high;
4. Are there other processes occupying GPU memory;
5. Is the dtype reasonable;
6. Should you switch to a smaller model or use quantization.

### Issue: Can start, but becomes slow with increased concurrency

Priority checks:

1. Is the workload long-prefill;
2. Is `max_num_batched_tokens` too small or too large;
3. Are all requests producing very long outputs;
4. Is GPU utilization low;
5. Is the benchmark including client-side bottlenecks.

### Issue: Benchmark numbers differ significantly from others

Priority checks:

1. Is the model the same;
2. Are the prompt/output length distributions the same;
3. Is the concurrency the same;
4. Is streaming enabled;
5. Are the GPU, driver, CUDA, and dtype the same;
6. Is the vLLM commit the same;
7. Are prefix cache, chunked prefill, quantization, and speculative decoding enabled.

## Part 8: vLLM Learning Verification Questions

After completion, try to answer:

1. Why is vLLM more suitable for high-concurrency serving than direct `transformers.generate()`?
2. What problem does PagedAttention solve for KV cache?
3. What is the difference between continuous batching and regular batching?
4. How does the scheduler decide which requests to process next?
5. Does prefix cache hit affect TTFT or TPOT? Why?
6. Where are the bottlenecks for long prompt workload versus long output workload respectively?
7. Can you reproduce a vLLM issue and provide a minimal script?