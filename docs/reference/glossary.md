# 术语表

| 术语 | 含义 |
|---|---|
| TTFT | Time To First Token，首 token 延迟 |
| TPOT | Time Per Output Token，每个输出 token 的平均生成时间 |
| Prefill | 处理 prompt 并生成初始 KV cache 的阶段 |
| Decode | 自回归逐 token 生成阶段 |
| KV Cache | attention key/value 的缓存，用于减少重复计算 |
| Continuous Batching | 在生成过程中持续合并和调度请求的 batching 策略 |
| Paged Attention | 用分页式块管理 KV cache 的 attention 机制 |
