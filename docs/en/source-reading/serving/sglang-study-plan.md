# SGLang Study Plan

This document provides a dedicated study plan for SGLang. The goal is to understand how SGLang serves complex LLM programs, not just how to launch an HTTP server.

## Learning Objectives

After completing this plan, you should be able to:

1. Launch a SGLang OpenAI-compatible server;
2. Use the native generation / offline engine;
3. Understand the engineering significance of RadixAttention, prefix cache, and structured output;
4. Compare the differences between SGLang and vLLM in terms of workload, API, and runtime;
5. Reproduce issues and submit examples, documentation, tests, benchmarks, or small feature PRs.

## Official Resources

Prioritize official documentation and source code:

- Quick Start: https://docs.sglang.ai/start/install.html
- Backend Usage: https://docs.sglang.ai/basic_usage/backend.html
- Structured Outputs: https://docs.sglang.ai/advanced_features/structured_outputs.html
- GitHub: https://github.com/sgl-project/sglang
- Paper: https://arxiv.org/abs/2312.07104

## Part 1: Get the Server Running First

### Experiment 1: OpenAI-compatible Server

Goal: Launch the service in a way similar to vLLM, to avoid being distracted by API differences at the start.

Launch example:

```bash
python -m sglang.launch_server \
  --model-path Qwen/Qwen2.5-1.5B-Instruct \
  --host 0.0.0.0 \
  --port 30000
```

Client example:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:30000/v1",
    api_key="EMPTY",
)

resp = client.chat.completions.create(
    model="Qwen/Qwen2.5-1.5B-Instruct",
    messages=[{"role": "user", "content": "Explain RadixAttention briefly."}],
)
print(resp.choices[0].message.content)
```

Deliverables:

```text
sglang_labs/run_server.sh
sglang_labs/client_openai.py
```

### Experiment 2: Streaming

Goal: Understand SGLang's streaming behavior and compare it with vLLM streaming.

Things to record:

- TTFT;
- token chunk interval;
- E2E latency;
- server-side logs.

Deliverables:

```text
sglang_labs/client_streaming.py
sglang_labs/streaming_notes.md
```

## Part 2: Native / Offline Engine

SGLang is not just an HTTP server. One of its strengths is expressing more complex generation workflows as programs.

### Experiment 3: Offline Engine

Goal: Understand how to use the SGLang engine directly without going through HTTP.

Things to observe:

- batch input;
- output token count;
- throughput;
- GPU memory usage;
- differences compared to server mode.

Deliverables:

```text
sglang_labs/offline_engine.py
sglang_labs/offline_engine_notes.md
```

### Experiment 4: Multi-turn Generation Program

Goal: Understand why there is room for prefix reuse across multiple generation calls.

Construct an example:

```text
Fixed system prompt
→ multiple user questions
→ same format output
→ compare prefix cache enabled/disabled
```

Deliverables:

```text
sglang_labs/multi_turn_prefix.py
sglang_labs/prefix_cache_report.md
```

## Part 3: Structured Output

Both the SGLang paper and documentation emphasize structured output. This is the key entry point to SGLang's distinctive capabilities.

### Experiment 5: JSON Output

Goal: Compare the difference between "prompt requests JSON output" and "decoder-level structured constraints."

Experiment design:

1. Without constraints, only request JSON output in the prompt;
2. Use JSON schema / regex / grammar constraints;
3. Compare the proportion of valid JSON, TTFT, TPOT, and failure cases.

Deliverables:

```text
sglang_labs/structured_output.py
sglang_labs/structured_output_report.md
```

### Key Concepts to Understand

- Constrained decoding limits the candidate set for the next token;
- More complex structures may lead to higher decoding overhead;
- Decoder-level constraints are typically more reliable than prompt-only approaches;
- Schema design affects both speed and stability.

## Part 4: RadixAttention / Prefix Cache

One of SGLang's core features is leveraging program structure for KV cache reuse.

### Experiment 6: Shared Prefix Workload

Construct three groups of requests:

| Group | Characteristics |
|---|---|
| A | Completely different prompts |
| B | Same system prompt, different user prompts |
| C | Same system prompt + same few-shot examples, different user prompts |

Things to record:

- TTFT;
- output tokens/s;
- cache hit related logs;
- GPU memory changes;
- benefits under varying concurrency.

Deliverables:

```text
sglang_labs/radix_cache_benchmark.py
sglang_labs/radix_cache_report.md
```

### Questions to Answer

1. Does prefix cache hit primarily improve TTFT or TPOT?
2. Why is token-level prefix matching more reliable than string matching?
3. Why are multi-turn conversations naturally suited for prefix reuse?
4. When is prefix reuse effective and when is it not in RAG scenarios?

## Part 5: Source Code Reading Order

Do not start directly from kernels or complex backends.

### 1. Server Entrypoint

Goal: Understand how `launch_server` starts the backend.

Questions to answer:

- How are server parameters parsed?
- How is the model loaded?
- How does the HTTP API connect to the backend?
- What are the differences between OpenAI-compatible API and native API?

### 2. Runtime / Scheduler

Goal: Understand how requests enter the runtime and are scheduled.

Questions to answer:

- How are waiting / running requests maintained?
- How are batches constructed?
- How are prefill and decode handled?
- How does streaming return results?

### 3. Memory Pools

Goal: Understand how token, request, and KV cache related resources are managed.

Questions to answer:

- What is the token pool responsible for?
- What is the KV pool responsible for?
- How are resources released after a request completes?
- How is GPU memory shortage handled?

### 4. Radix Cache

Goal: Understand the data structure behind prefix reuse.

Questions to answer:

- What does the radix tree store?
- How is token prefix looked up?
- How is KV reused after a cache hit?
- What is the eviction strategy?

### 5. Structured Output Backend

Goal: Understand how constrained decoding is integrated into the runtime.

Questions to answer:

- How are schema / grammar converted into constraints?
- How are valid tokens computed at each decode step?
- How are constraint failures handled?
- Why might complex schemas reduce speed?

## Part 6: Comparative Learning with vLLM

Do not treat them as complete replacements for each other. A better approach is to compare by workload.

| Dimension | vLLM | SGLang |
|---|---|---|
| Entry perspective | High-performance serving engine | Complex LLM program runtime |
| Typical strengths | throughput, paged KV, general serving | prefix reuse, structured output, complex generation workflows |
| API | OpenAI-compatible, offline inference | OpenAI-compatible, native generation, offline engine |
| Key paper concepts | PagedAttention | RadixAttention, compressed FSM |
| Learning focus | scheduler, KV block, model runner | runtime, radix cache, structured decoding |

Suggested experiment comparisons:

1. Same model, same prompt, same concurrency;
2. short-short / short-long / long-short / long-long;
3. With shared prefix vs. without shared prefix;
4. JSON structured output;
5. Streaming vs. non-streaming.

## Part 7: Beginner-friendly Contribution Entry Points

### Documentation / Examples

Good candidates to fix:

- Quickstart commands inconsistent with actual versions;
- Missing OpenAI client examples;
- Structured output examples not minimal enough;
- Unclear server parameter documentation;
- Missing benchmark reproduction steps.

### Issue Reproduction

Good candidates to reproduce:

- Model fails to start;
- Structured output does not meet expectations;
- Prefix cache behaves abnormally;
- Streaming returns abnormal results;
- A certain parameter combination causes OOM or crash.

### Test / Benchmark

Good candidates for contribution:

- Add minimal tests for bugs;
- Add regression tests for a certain type of structured output;
- Add small benchmark cases;
- Reproduce performance changes for a certain PR.

Do not start with:

- Major changes to the runtime scheduler;
- Major changes to the radix cache;
- Multi-backend adaptation;
- Kernel-level optimization;
- Large-scale distributed features.

## Part 8: Common Issues

### Issue: Server starts successfully but requests fail

Check the following first:

1. Does the `model` field match the model name on the server side?
2. Is the base URL using `/v1`?
3. Does the model require trust remote code?
4. Is the chat template compatible?
5. Does the request format conform to the OpenAI-compatible API?

### Issue: Structured output is very slow

Check the following first:

1. Is the schema too complex?
2. Are large enums being used?
3. Does the regex introduce a large number of candidate states?
4. Are max output tokens set too high?
5. Should the schema be simplified or split into multi-step generation?

### Issue: No visible benefit from prefix cache

Check the following first:

1. Do requests actually share a token prefix?
2. Does the chat template cause different token sequences?
3. Are the system prompt / few-shot examples completely identical?
4. Do request intervals cause cache eviction?
5. Is the benchmark mainly decode-heavy, where prefix cache has limited improvement on TPOT?

## Part 9: SGLang Knowledge Verification Questions

After completing the plan, try to answer:

1. How does the core problem solved by SGLang differ from vLLM?
2. How does RadixAttention reuse KV cache?
3. Why does structured output require decoder-level constraints?
4. Which workloads benefit most from prefix cache?
5. What are the differences in cache reuse across multi-turn conversations, few-shot, and RAG scenarios?
6. How do you reproduce a SGLang issue and submit a minimal script?
