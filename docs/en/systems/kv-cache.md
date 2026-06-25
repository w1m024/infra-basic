# KV Cache System

KV cache is the core system resource in LLM serving. It both reduces redundant computation and becomes the main constraint for memory, scheduling, and cache reuse.

## Basic Role

In autoregressive generation, decode adds only one token per step, but attention needs to access the key/value of historical tokens. KV cache stores historical token K/V to avoid recomputing the entire prompt at each step.

## System Issues

| Issue | Description |
|---|---|
| Memory budget | Cache size grows with layers, heads, head dim, sequence length, batch |
| Allocation | Different request lengths cause continuous memory fragmentation |
| Reuse | Same prefix can reuse already computed KV |
| Release | Need to return blocks after request ends |
| Offload | May transfer to CPU / SSD / remote cache when memory is insufficient |
| Migration | Cache transfer needed in PD disaggregation or multi-node serving |

## Typical Implementations

| Mechanism | Representative Project | Learning Focus |
|---|---|---|
| Paged KV cache | vLLM | block table, paged attention, fragmentation |
| Radix cache | SGLang | token prefix tree, prefix reuse |
| Blocked KV cache | LMDeploy / TurboMind | block management and persistent batching |
| Multi-tier KV cache | LMCache / Dynamo / Mooncake | GPU / CPU / storage / remote cache |

## Pass Criteria

You can explain why KV cache both improves performance and consumes large amounts of memory, and why the scheduler must know KV cache block status.
