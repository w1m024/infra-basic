# 03. SGLang Study Plan

本文档给出 SGLang 专项学习计划。目标是理解 SGLang 如何服务复杂 LLM 程序，而不是只会启动一个 HTTP server。

## 学习目标

完成本计划后，应该能够：

1. 启动 SGLang OpenAI-compatible server；
2. 使用 native generation / offline engine；
3. 理解 RadixAttention、prefix cache、structured output 的工程意义；
4. 能对比 SGLang 与 vLLM 在 workload、API、runtime 侧的差异；
5. 能复现 issue，提交 example、文档、测试、benchmark 或小功能 PR。

## 官方资料入口

优先使用官方文档和源码：

- Quick Start: https://docs.sglang.ai/start/install.html
- Backend Usage: https://docs.sglang.ai/basic_usage/backend.html
- Structured Outputs: https://docs.sglang.ai/advanced_features/structured_outputs.html
- GitHub: https://github.com/sgl-project/sglang
- Paper: https://arxiv.org/abs/2312.07104

## Part 1：先跑通 server

### 实验 1：OpenAI-compatible server

目标：用和 vLLM 类似的方式启动服务，避免一开始被 API 差异干扰。

启动示例：

```bash
python -m sglang.launch_server \
  --model-path Qwen/Qwen2.5-1.5B-Instruct \
  --host 0.0.0.0 \
  --port 30000
```

客户端示例：

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

交付物：

```text
sglang_labs/run_server.sh
sglang_labs/client_openai.py
```

### 实验 2：Streaming

目标：理解 SGLang 的 streaming 行为，并和 vLLM streaming 对比。

需要记录：

- TTFT；
- token chunk 间隔；
- E2E latency；
- 服务端日志。

交付物：

```text
sglang_labs/client_streaming.py
sglang_labs/streaming_notes.md
```

## Part 2：Native / offline engine

SGLang 不只是 HTTP server。它的强项之一是把更复杂的 generation workflow 表达为程序。

### 实验 3：Offline engine

目标：理解不通过 HTTP 时如何直接使用 SGLang engine。

需要观察：

- batch 输入；
- 输出 token 数；
- throughput；
- 显存占用；
- 与 server 模式的差异。

交付物：

```text
sglang_labs/offline_engine.py
sglang_labs/offline_engine_notes.md
```

### 实验 4：多轮生成程序

目标：理解多个 generation calls 之间为什么存在 prefix reuse 空间。

构造例子：

```text
固定 system prompt
→ 多个用户问题
→ 相同格式输出
→ 对比 prefix cache 打开/关闭
```

交付物：

```text
sglang_labs/multi_turn_prefix.py
sglang_labs/prefix_cache_report.md
```

## Part 3：Structured Output

SGLang 论文和文档都强调 structured output。这里是进入 SGLang 特色能力的关键。

### 实验 5：JSON output

目标：比较“prompt 要求输出 JSON”和“decoder-level 结构化约束”的差异。

实验设计：

1. 不使用约束，只在 prompt 中要求输出 JSON；
2. 使用 JSON schema / regex / grammar 约束；
3. 对比合法 JSON 比例、TTFT、TPOT、失败样例。

交付物：

```text
sglang_labs/structured_output.py
sglang_labs/structured_output_report.md
```

### 需要理解

- constrained decoding 会限制下一 token 的候选集合；
- 结构越复杂，解码开销可能越高；
- decoder-level 约束通常比 prompt-only 更可靠；
- schema 设计会影响速度和稳定性。

## Part 4：RadixAttention / Prefix Cache

SGLang 的核心之一是利用程序结构进行 KV cache 复用。

### 实验 6：共享前缀 workload

构造三组请求：

| 组别 | 特征 |
|---|---|
| A | 完全不同 prompt |
| B | 相同 system prompt，不同 user prompt |
| C | 相同 system prompt + 相同 few-shot examples，不同 user prompt |

需要记录：

- TTFT；
- output tokens/s；
- cache hit 相关日志；
- 显存变化；
- 并发变化下的收益。

交付物：

```text
sglang_labs/radix_cache_benchmark.py
sglang_labs/radix_cache_report.md
```

### 需要回答

1. prefix cache 命中主要改善 TTFT 还是 TPOT？
2. 为什么 token-level prefix 匹配比字符串匹配更可靠？
3. 多轮对话为什么天然适合 prefix reuse？
4. RAG 场景中 prefix reuse 何时有效、何时无效？

## Part 5：源码阅读顺序

不要直接从 kernel 或复杂后端开始。

### 1. Server entrypoint

目标：理解 `launch_server` 如何启动后端。

需要回答：

- server 参数如何解析；
- 模型如何加载；
- HTTP API 如何接入后端；
- OpenAI-compatible API 与 native API 的差异。

### 2. Runtime / scheduler

目标：理解请求如何进入运行时并被调度。

需要回答：

- waiting / running request 如何维护；
- batch 如何构造；
- prefill 与 decode 如何处理；
- streaming 如何返回。

### 3. Memory pools

目标：理解 token、request、KV cache 相关资源如何管理。

需要回答：

- token pool 负责什么；
- KV pool 负责什么；
- 请求结束后如何释放；
- 显存不足时如何处理。

### 4. Radix cache

目标：理解 prefix reuse 的数据结构。

需要回答：

- radix tree 存什么；
- token prefix 如何查找；
- cache hit 后如何复用 KV；
- eviction 策略是什么。

### 5. Structured output backend

目标：理解 constrained decoding 在 runtime 中如何接入。

需要回答：

- schema / grammar 如何转换成约束；
- 每步 decode 如何计算合法 token；
- 约束失败如何处理；
- 为什么复杂 schema 可能降低速度。

## Part 6：与 vLLM 的对比学习

不要把两者理解为完全替代关系。更好的方式是按 workload 对比。

| 维度 | vLLM | SGLang |
|---|---|---|
| 入门视角 | 高性能 serving engine | 复杂 LLM program runtime |
| 典型强项 | throughput、paged KV、通用 serving | prefix reuse、structured output、复杂 generation workflow |
| API | OpenAI-compatible、offline inference | OpenAI-compatible、native generation、offline engine |
| 重点论文概念 | PagedAttention | RadixAttention、compressed FSM |
| 学习重点 | scheduler、KV block、model runner | runtime、radix cache、structured decoding |

实验对比建议：

1. 同模型、同 prompt、同并发；
2. short-short / short-long / long-short / long-long；
3. 有共享 prefix 与无共享 prefix；
4. JSON structured output；
5. streaming 与 non-streaming。

## Part 7：适合新手的贡献入口

### 文档 / example

适合修：

- quickstart 命令与实际版本不一致；
- OpenAI client 示例缺失；
- structured output 示例不够最小；
- server 参数说明不清楚；
- benchmark 复现步骤缺失。

### Issue reproduction

适合复现：

- 某模型启动失败；
- structured output 不符合预期；
- prefix cache 行为异常；
- streaming 返回异常；
- 某参数组合导致 OOM 或 crash。

### Test / benchmark

适合贡献：

- 为 bug 增加最小测试；
- 增加某类 structured output 的 regression test；
- 增加小型 benchmark case；
- 对某 PR 的性能变化做复现。

不要一开始做：

- 大改 runtime scheduler；
- 大改 radix cache；
- 多后端适配；
- kernel 级优化；
- 大规模分布式功能。

## Part 8：常见问题

### 问题：server 启动成功但请求失败

优先检查：

1. `model` 字段是否和 server 侧模型名称匹配；
2. base URL 是否使用 `/v1`；
3. 模型是否需要 trust remote code；
4. chat template 是否兼容；
5. 请求格式是否符合 OpenAI-compatible API。

### 问题：structured output 很慢

优先检查：

1. schema 是否过于复杂；
2. 是否使用了大型 enum；
3. 正则是否引入大量候选状态；
4. max output tokens 是否过大；
5. 是否需要简化 schema 或拆成多步生成。

### 问题：prefix cache 看不到收益

优先检查：

1. 请求是否真的共享 token prefix；
2. chat template 是否导致 token 序列不同；
3. system prompt / few-shot examples 是否完全一致；
4. 请求间隔是否导致 cache eviction；
5. benchmark 是否主要是 decode-heavy，prefix cache 对 TPOT 改善有限。

## Part 9：SGLang 学习验收题

完成后，尝试回答：

1. SGLang 解决的核心问题和 vLLM 有什么不同？
2. RadixAttention 如何复用 KV cache？
3. structured output 为什么需要 decoder-level 约束？
4. prefix cache 对哪些 workload 最有效？
5. 多轮对话、few-shot、RAG 三类场景的 cache reuse 有什么差别？
6. 如何复现一个 SGLang issue 并提交最小脚本？
