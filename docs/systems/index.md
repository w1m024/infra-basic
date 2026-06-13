# 系统原理

推理系统主线关注请求如何从 API 进入 serving engine，并在调度、KV cache、worker、kernel、streaming 和指标采集中完成闭环。

## 阅读顺序

1. [推理系统总览](./overview.md)
2. [Prefill / Decode](./prefill-decode.md)
3. [KV Cache](./kv-cache.md)
4. [Scheduler & Batching](./scheduler-batching.md)
5. [Serving API & Streaming](./serving-api-streaming.md)
6. [Benchmark & Profiling](./benchmark-profiling.md)
7. [Distributed Inference](./distributed-inference.md)
8. [Production Serving](./production-serving.md)

## 和源码阅读的连接

- 读 vLLM / SGLang 前，先理解 prefill/decode、KV cache 和 scheduler。
- 读 FlashInfer / FlashAttention 前，先理解 attention backend 的输入输出边界。
- 读 DeepEP 前，先理解 distributed inference 和 expert parallel 的通信边界。
