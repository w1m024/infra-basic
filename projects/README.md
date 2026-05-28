# Projects

本目录定义 infra-basic 的实践项目。每个项目都应该产出代码、实验记录和简短结论。

## 项目总览

| 项目 | 目标 | 难度 | 对应阶段 |
|---|---|---:|---|
| P0 Torch Inference Basics | 掌握 tensor / dtype / device / memory / profiler | 1 | PyTorch |
| P1 Naive Generation | 手写 autoregressive decoding | 2 | Transformers |
| P2 KV Cache Generation | 对比无 KV cache 与有 KV cache 的生成 | 2 | Transformers |
| P3 Toy LLM Server | 写一个很慢但可观测的 LLM server | 3 | Serving |
| P4 vLLM Lab | 跑通 vLLM server、benchmark 和源码笔记 | 4 | vLLM |
| P5 SGLang Lab | 跑通 SGLang server、structured output、prefix cache | 4 | SGLang |
| P6 Paper Reproduction Notes | 每篇论文复现一个关键现象 | 4 | Papers |
| P7 First OSS Contribution | 完成一个 issue reproduction / docs / test PR | 5 | Open source |

## P0. Torch Inference Basics

### 目标

理解推理阶段最常见的底层问题：dtype、device、batch、显存和 profiling。

### 需要实现

```text
experiments/torch_memory.py
experiments/matmul_benchmark.py
experiments/profiler_demo.py
```

### 必做实验

1. 比较 fp32 / fp16 / bf16 tensor 显存；
2. 比较 CPU / GPU matmul 耗时；
3. 比较 batch size 变化对耗时和显存的影响；
4. 使用 `torch.profiler` 观察一次模型 forward。

### 交付物

```text
reports/p0_torch_inference.md
```

报告至少包含：

- 实验环境；
- 输入 shape；
- dtype；
- 耗时；
- 显存；
- 观察结论。

## P1. Naive Generation

### 目标

不用 `model.generate()`，手写最简单的 autoregressive decoding loop。

### 需要实现

```text
experiments/generate_naive.py
experiments/sampling.py
```

### 必做实验

1. greedy decoding；
2. temperature sampling；
3. top-p sampling；
4. top-k sampling；
5. 不同 prompt length 下的耗时。

### 通过标准

能解释：

- logits 是什么；
- 为什么取最后一个 token 的 logits；
- 为什么每生成一个 token 都要再 forward；
- sampling 参数如何影响输出。

## P2. KV Cache Generation

### 目标

理解 KV cache 如何减少重复计算，以及它为什么消耗大量显存。

### 需要实现

```text
experiments/generate_with_kv_cache.py
experiments/kv_cache_memory.py
```

### 必做实验

1. naive decoding vs KV cache decoding；
2. prompt length 128 / 1024 / 4096；
3. output length 32 / 128 / 512；
4. 记录 TTFT 和 TPOT；
5. 记录显存峰值。

### 报告表格

| prompt tokens | output tokens | cache | TTFT | TPOT | peak memory | notes |
|---:|---:|---|---:|---:|---:|---|
| 128 | 128 | off | | | | |
| 128 | 128 | on | | | | |
| 1024 | 128 | off | | | | |
| 1024 | 128 | on | | | | |

## P3. Toy LLM Server

### 目标

写一个低效但可观测的 LLM HTTP server。它的价值在于暴露真实 serving 痛点。

### 需要实现

```text
toy_server/server.py
toy_server/client.py
toy_server/client_streaming.py
benchmarks/benchmark_toy_server.py
```

### 功能要求

- `/v1/chat/completions`；
- non-streaming；
- streaming；
- 记录 TTFT、TPOT、E2E latency；
- 支持并发压测；
- 输出 benchmark CSV。

### 必做实验

| concurrency | prompt tokens | max output tokens | expected observation |
|---:|---:|---:|---|
| 1 | 128 | 128 | baseline |
| 4 | 128 | 128 | 并发带来的排队 |
| 8 | 1024 | 128 | prefill 压力 |
| 8 | 128 | 512 | decode 压力 |

### 通过标准

能解释：

- 为什么每个请求独立 generate 会低效；
- 为什么 request-level batching 不适合长短不一的生成；
- 为什么 serving 系统需要 scheduler。

## P4. vLLM Lab

### 目标

掌握 vLLM 的基础使用、benchmark 方法和源码主路径。

### 需要实现

```text
vllm_labs/run_server.sh
vllm_labs/client_openai.py
vllm_labs/client_streaming.py
vllm_labs/benchmark_serving.sh
vllm_labs/benchmark_report.md
vllm_labs/source_notes.md
```

### 必做实验

1. offline batched inference；
2. OpenAI-compatible server；
3. streaming；
4. 不同 `max_model_len`；
5. 不同 `gpu_memory_utilization`；
6. 有无 prefix caching；
7. short-short / short-long / long-short / long-long workload。

### 源码笔记必须覆盖

- API server；
- engine；
- scheduler；
- KV cache manager；
- model runner；
- attention backend。

## P5. SGLang Lab

### 目标

掌握 SGLang 的 server、offline engine、structured output 和 prefix reuse。

### 需要实现

```text
sglang_labs/run_server.sh
sglang_labs/client_openai.py
sglang_labs/client_streaming.py
sglang_labs/offline_engine.py
sglang_labs/structured_output.py
sglang_labs/radix_cache_benchmark.py
sglang_labs/source_notes.md
```

### 必做实验

1. OpenAI-compatible server；
2. offline engine；
3. streaming；
4. JSON schema / regex / grammar structured output；
5. 共享 prefix 与不共享 prefix 的对比；
6. 与 vLLM 在相同模型、相同 workload 下对比。

### 通过标准

能解释：

- RadixAttention 与 prefix cache 的关系；
- structured output 为什么需要 decoder-level 约束；
- SGLang 更适合哪些复杂 generation workflow。

## P6. Paper Reproduction Notes

### 目标

每篇关键论文复现一个现象，而不是完整复现系统。

### 推荐任务

| 论文方向 | 最小复现 |
|---|---|
| FlashAttention | prompt length 对 attention 耗时的影响 |
| Orca | 普通 batch vs iteration-level scheduling 的差异 |
| PagedAttention | max context 对 KV cache 显存预算的影响 |
| SGLang | 共享 prefix 对 TTFT 的影响 |
| Sarathi-Serve | long prefill 对 decode 延迟的影响 |
| Speculative Decoding | acceptance rate 与加速比 |

### 笔记模板

```text
Paper:
Claim:
Minimal experiment:
Setup:
Result:
Does it match the claim:
Limitation:
```

## P7. First OSS Contribution

### 目标

完成第一个真实开源贡献，可以是 PR，也可以是高质量 issue reproduction。

### 候选任务

- 修正文档命令；
- 补充一个小 example；
- 复现一个 issue；
- 写一个 regression test；
- 复现一个 benchmark；
- 提交一个小 bugfix。

### 验收标准

至少完成以下之一：

1. 一个 merged PR；
2. 一个被维护者确认有效的 issue reproduction；
3. 一个被项目采用或讨论的 benchmark report；
4. 一个能帮助定位 bug 的最小测试用例。

## 实验记录规范

所有实验都应该记录：

```text
Date:
Commit:
Model:
GPU:
CUDA:
Command:
Workload:
Metrics:
Observation:
Next step:
```

## 建议目录

```text
experiments/
toy_server/
benchmarks/
vllm_labs/
sglang_labs/
reports/
notes/
```
