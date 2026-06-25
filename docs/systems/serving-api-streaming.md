# Serving API 与 Streaming

Serving API 把推理系统暴露给客户端。学习时不要只看 endpoint 名字，要理解 request lifecycle、streaming、backpressure 和错误处理。

## 常见接口

| 接口 | 作用 |
|---|---|
| `/v1/chat/completions` | OpenAI-compatible chat |
| `/v1/completions` | text completion |
| native generate API | 框架内部 / offline inference |
| batch inference | 离线批量生成 |

## Streaming

Streaming 通常使用 SSE 或 chunked response。它影响：

- TTFT 观测方式；
- client read loop；
- server flush / backpressure；
- cancellation；
- tokenizer / detokenizer 输出边界；
- error handling。

## 系统问题

| 问题 | 关注点 |
|---|---|
| Request parsing | messages、sampling params、model name、extra fields |
| Queueing | admission control、timeout、priority |
| Streaming chunks | delta format、finish reason、usage |
| Cancellation | client disconnect 后是否释放 request 和 cache |
| Compatibility | OpenAI-compatible API 行为差异 |

## 通过标准

能写一个 toy server，并解释为什么它离 vLLM / SGLang 还差 scheduler、KV cache manager 和高性能 backend。
