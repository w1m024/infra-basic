# DeepSeek Infra Stack Map

覆盖：FlashMLA、DeepGEMM、DeepEP、3FS，LMCache 作为 cache 对照。

## 层次

| 层 | 项目 | 关注点 |
|---|---|---|
| Attention | FlashMLA | MLA attention layout 和 decode/prefill kernel |
| GEMM | DeepGEMM | FP8 GEMM、grouped GEMM、tuning |
| Communication | DeepEP | expert parallel dispatch/combine |
| Storage | 3FS | AI workload filesystem |
| Cache | LMCache | KV cache reuse/offload |

## 为什么是系统协同案例

模型结构改变会把压力传导到 kernel、通信、cache 和存储。DeepSeek 相关项目适合观察模型结构和系统实现如何共同决定性能边界。

## 初学者顺序

先读 FlashMLA/DeepGEMM 的 API 和 benchmark，再读 DeepEP 的 dispatch/combine，最后把 3FS/LMCache 作为生产边界对照。
