# KV Cache 系统

KV cache 是 LLM serving 的核心系统资源。它既减少重复计算，也成为显存、调度和 cache 复用的主要约束。

## 基本作用

自回归生成中，decode 每步只新增一个 token，但 attention 需要访问历史 token 的 key / value。KV cache 保存历史 token 的 K/V，避免每步重复计算整个 prompt。

## 系统问题

| 问题 | 说明 |
|---|---|
| 显存预算 | cache 大小随 layer、head、head dim、sequence length、batch 增长 |
| 分配 | 不同请求长度不同，连续显存容易碎片化 |
| 复用 | 相同 prefix 可以复用已计算 KV |
| 释放 | 请求结束后需要归还 block |
| offload | 显存不足时可能转移到 CPU / SSD / remote cache |
| 迁移 | PD disaggregation 或 multi-node serving 中需要 cache transfer |

## 典型实现

| 机制 | 代表项目 | 学习重点 |
|---|---|---|
| Paged KV cache | vLLM | block table、paged attention、fragmentation |
| Radix cache | SGLang | token prefix tree、prefix reuse |
| Blocked KV cache | LMDeploy / TurboMind | block 管理和 persistent batching |
| Multi-tier KV cache | LMCache / Dynamo / Mooncake | GPU / CPU / storage / remote cache |

## 通过标准

能解释 KV cache 为什么既提升性能又消耗大量显存，以及 scheduler 为什么必须知道 KV cache block 状态。
