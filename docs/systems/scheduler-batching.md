# 调度与批处理

LLM serving 系统的核心不是 HTTP，而是 scheduler。Scheduler 决定每一步哪些请求进入模型 forward，以及 prefill / decode 如何混合。

## Batching 形态

| 形态 | 特点 | 问题 |
|---|---|---|
| Static batching | 一组请求一起开始一起结束 | 长短不一时浪费严重 |
| Dynamic batching | 短时间窗口内合并请求 | 对自回归 decode 不够 |
| Continuous batching | 每个 decode step 都可加入 / 移除请求 | serving engine 主流方式 |
| Chunked prefill | 长 prompt 分块调度 | 降低 decode starvation |

## Scheduler 需要考虑

- waiting / running request 状态转移；
- 每步 token budget；
- prefill 和 decode 的优先级；
- KV cache block 是否够用；
- streaming 请求是否及时返回 chunk；
- speculative decoding 是否带来额外 token；
- fairness、priority、timeout、cancellation。

## 源码阅读问题

1. 请求何时从 waiting 进入 running；
2. 每轮 step 的 token budget 如何计算；
3. prefill-heavy workload 是否会阻塞 decode；
4. KV cache 不足时如何处理；
5. 请求完成后 state 和 cache 如何释放。

## 通过标准

能解释 continuous batching 为什么比普通 batching 更适合 LLM serving。
