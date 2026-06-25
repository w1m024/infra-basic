# 推理系统总览

本章从系统角度理解 LLM 推理，而不是从某个框架命令开始。目标是先建立请求生命周期，再去读 vLLM、SGLang、TensorRT-LLM、TGI、DeepSeek infra 等项目的源码。

## 请求生命周期

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

## 系统核心模块

| 模块 | 负责什么 | 典型源码位置 |
|---|---|---|
| API layer | 解析 OpenAI-compatible / native request，处理 streaming | server / api / protocol |
| Request state | 保存 prompt、生成参数、进度、输出 token | request / sequence / state |
| Scheduler | 决定每一步处理哪些请求和多少 token | scheduler / engine |
| KV cache manager | 分配、复用、释放 KV cache block | cache / block manager |
| Model runner | 组 batch，准备 token ids、positions、metadata | worker / model_runner |
| Attention backend | 执行 attention kernel，消费 KV metadata | attention / backend / kernel |
| Sampler | temperature、top-p、top-k、grammar、structured output | sampler / logits processor |

## 学习顺序

```text
Prefill / Decode
→ KV Cache System
→ Scheduler & Batching
→ Serving API & Streaming
→ Benchmark & Profiling
→ Distributed Inference
→ Production Serving
```

## 通过标准

能画出一个请求在 serving engine 中的主路径，并解释 TTFT、TPOT、KV cache、scheduler 和 attention backend 分别影响什么。
