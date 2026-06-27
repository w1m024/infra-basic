# vLLM 学习计划

本文档给出 vLLM 专项学习计划。目标是从“会启动 vLLM”逐步进入“能定位代码、复现问题、做 benchmark、提交小 PR”。

## 学习目标

完成本计划后，应该能够：

1. 启动 vLLM offline inference 和 OpenAI-compatible server；
2. 解释请求在 vLLM 中的主要路径；
3. 理解 scheduler、KV cache manager、model runner、attention backend 的职责；
4. 能设计基础 benchmark 并解释结果；
5. 能复现 issue，提交文档、测试、benchmark 或小功能 PR。

## 官方资料入口

优先使用官方文档和源码：

- Quickstart: https://docs.vllm.ai/en/latest/getting_started/quickstart.html
- Architecture Overview: https://docs.vllm.ai/en/latest/design/arch_overview.html
- V1 Guide: https://docs.vllm.ai/en/latest/usage/v1_guide.html
- Scheduler API docs: https://docs.vllm.ai/en/latest/api/vllm/v1/core/sched/scheduler.html
- GitHub: https://github.com/vllm-project/vllm

## Part 1：先跑通，不读源码

### 实验 1：Offline batched inference

目标：理解 vLLM 不一定需要 HTTP server，也可以直接做离线批量推理。

需要观察：

- 输入 batch size；
- 输出 token 数；
- 首次加载模型耗时；
- 生成阶段耗时；
- GPU 显存占用。

交付物：

```text
vllm_labs/offline_inference.py
vllm_labs/logs/offline_inference.md
```

### 实验 2：OpenAI-compatible server

目标：理解 vLLM 作为服务端的基本使用方式。

启动示例：

```bash
vllm serve Qwen/Qwen2.5-1.5B-Instruct \
  --host 0.0.0.0 \
  --port 8000
```

客户端：

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

交付物：

```text
vllm_labs/run_server.sh
vllm_labs/client_openai.py
```

### 实验 3：Streaming

目标：理解 token streaming 与非流式返回的差异。

需要记录：

- 第一个 chunk 到达时间；
- 全部完成时间；
- 平均 token 间隔。

交付物：

```text
vllm_labs/client_streaming.py
vllm_labs/streaming_notes.md
```

## Part 2：参数实验

### 参数 1：`--max-model-len`

要观察：

- max context 越大，KV cache 预算如何变化；
- 显存不足时会出现什么错误；
- 实际 workload 如果不需要长上下文，为什么不应该盲目拉大。

实验表格：

| max_model_len | idle memory | max concurrency | TTFT | output tokens/s | notes |
|---|---:|---:|---:|---:|---|
| 2048 | | | | | |
| 4096 | | | | | |
| 8192 | | | | | |

### 参数 2：`--gpu-memory-utilization`

要观察：

- 值太低：可用 KV cache 少，并发能力下降；
- 值太高：容易 OOM，给临时 buffer、CUDA graph、其他进程留下空间不足；
- 生产配置需要结合模型、上下文、并发和显卡显存调。

### 参数 3：`--max-num-batched-tokens`

要观察：

- 它影响每轮调度能处理多少 token；
- 对 prefill-heavy workload 与 decode-heavy workload 的影响不同；
- 过大不一定总是更好，可能导致 TTFT 上升。

### 参数 4：prefix caching

要观察：

- 相同 system prompt；
- RAG 模板固定但文档不同；
- 多轮对话前缀逐渐增长；
- cache hit 与 miss 对 TTFT 的影响。

## Part 3：Benchmark 设计

不要只测一个 prompt。至少构造 4 类 workload：

| workload | 特征 | 目的 |
|---|---|---|
| short-short | 短 prompt，短输出 | 基础 latency |
| short-long | 短 prompt，长输出 | decode throughput |
| long-short | 长 prompt，短输出 | prefill / TTFT |
| long-long | 长 prompt，长输出 | 综合压力 |

建议固定变量：

- 模型名称；
- vLLM commit / version；
- GPU 型号；
- CUDA / driver；
- 启动参数；
- 并发数；
- prompt token 分布；
- output token 分布；
- 是否 streaming；
- 是否 prefix caching。

交付物：

```text
vllm_labs/benchmark_serving.sh
vllm_labs/benchmark_report.md
```

报告模板：

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

## Part 4：源码阅读顺序

不要从 CUDA kernel 开始。按请求路径读。

### 1. Entrypoints

目标：知道 `vllm serve` 和 Python `LLM` 分别进入哪里。

需要回答：

- online serving 和 offline inference 的入口分别是什么；
- OpenAI-compatible API 是如何接入 engine 的；
- streaming response 如何返回。

### 2. Engine

目标：理解 engine 是 API 层和底层执行层之间的桥。

需要回答：

- request 如何进入 engine；
- request state 如何维护；
- engine step 是什么；
- async engine 与 sync engine 的差异是什么。

### 3. Scheduler

目标：理解为什么 serving 系统的核心不是 HTTP，而是调度。

需要回答：

- waiting / running 请求如何转移；
- 每个 step 调度多少 token；
- prefill 与 decode 如何被组织；
- chunked prefill 如何避免长 prompt 阻塞；
- speculative decoding 时 scheduler 需要多处理什么。

### 4. KV Cache Manager

目标：理解 PagedAttention 在工程中的落点。

需要回答：

- block size 是什么；
- free block 如何管理；
- request 结束后如何释放；
- prefix caching 如何查找已计算 token；
- copy-on-write 或共享 block 在什么场景出现。

### 5. Model Runner

目标：理解真正调用模型 forward 的位置。

需要回答：

- 输入 batch 如何组装；
- token ids、positions、KV cache metadata 如何传入；
- logits 如何返回；
- sampler 在哪里工作。

### 6. Attention Backend

目标：知道 kernel/backend 在系统中的位置，而不是马上深入写 kernel。

需要回答：

- backend 如何选择；
- paged attention metadata 如何传给 backend；
- FlashAttention / FlashInfer / Triton backend 的大致角色；
- 什么情况下 backend 不支持某模型或某 dtype。

## Part 5：核心概念检查表

学习 vLLM 时必须能解释：

- PagedAttention
- continuous batching
- prefill / decode
- chunked prefill
- paged KV cache
- prefix caching
- speculative decoding
- tensor parallel
- pipeline parallel
- quantization
- OpenAI-compatible server
- streaming
- benchmark serving

## Part 6：适合新手的贡献入口

### 入口 1：文档 PR

适合修：

- 命令过期；
- 参数名变更；
- 示例模型不可用；
- 文档与实际行为不一致；
- 缺少 benchmark 说明。

### 入口 2：Example PR

适合做：

- 增加一个最小 OpenAI client 示例；
- 增加 streaming 示例；
- 增加 prefix caching 示例；
- 增加某模型的部署说明。

### 入口 3：Issue reproduction

流程：

```text
找到 issue
→ 确认版本和硬件
→ 写最小复现脚本
→ 记录启动命令、日志、报错
→ 判断是环境问题、模型问题、参数问题还是代码问题
→ 回复 issue 或提交 PR
```

### 入口 4：Benchmark reproduction

适合：

- 复现官方 benchmark；
- 对比两个 commit；
- 对比两个参数；
- 对比两种 workload。

不要一开始碰：

- scheduler 大改；
- KV cache manager 大改；
- CUDA/Triton kernel；
- 多机分布式；
- 涉及多个硬件后端的大 PR。

## Part 7：常见问题

### 问题：一启动就 OOM

优先检查：

1. 模型是否过大；
2. `max_model_len` 是否过大；
3. `gpu_memory_utilization` 是否过高；
4. 是否有其他进程占显存；
5. dtype 是否合理；
6. 是否应该换更小模型或用量化。

### 问题：能启动，但并发一上来就慢

优先检查：

1. workload 是否 long-prefill；
2. `max_num_batched_tokens` 是否过小或过大；
3. 是否所有请求输出很长；
4. GPU utilization 是否低；
5. benchmark 是否把 client 端瓶颈算进去了。

### 问题：和别人 benchmark 数字差很多

优先检查：

1. 模型是否相同；
2. prompt/output 长度分布是否相同；
3. 并发是否相同；
4. 是否 streaming；
5. GPU、driver、CUDA、dtype 是否相同；
6. vLLM commit 是否相同；
7. 是否启用了 prefix cache、chunked prefill、quantization、spec decoding。

## Part 8：vLLM 学习验收题

完成后，尝试回答：

1. vLLM 为什么比直接 `transformers.generate()` 更适合高并发 serving？
2. PagedAttention 解决了 KV cache 的什么问题？
3. continuous batching 与普通 batching 有什么区别？
4. scheduler 如何决定下一步处理哪些请求？
5. prefix cache 命中会影响 TTFT 还是 TPOT？为什么？
6. 长 prompt workload 与长输出 workload 的瓶颈分别在哪里？
7. 你能否复现一个 vLLM issue，并给出最小脚本？
