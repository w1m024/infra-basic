# Serving API & Streaming

Serving API exposes the inference system to clients. When learning, don't just look at endpoint names - understand request lifecycle, streaming, backpressure, and error handling.

## Common Endpoints

| Endpoint | Purpose |
|---|---|
| `/v1/chat/completions` | OpenAI-compatible chat |
| `/v1/completions` | text completion |
| native generate API | framework internal / offline inference |
| batch inference | offline batch generation |

## Streaming

Streaming typically uses SSE or chunked response. It affects:

- TTFT observation method;
- client read loop;
- server flush / backpressure;
- cancellation;
- tokenizer / detokenizer output boundary;
- error handling.

## System Issues

| Issue | Focus |
|---|---|
| Request parsing | messages, sampling params, model name, extra fields |
| Queueing | admission control, timeout, priority |
| Streaming chunks | delta format, finish reason, usage |
| Cancellation | Whether to release request and cache after client disconnect |
| Compatibility | OpenAI-compatible API behavior differences |

## Pass Criteria

You can write a toy server, and explain why it still lacks scheduler, KV cache manager, and high-performance backend compared to vLLM / SGLang.
