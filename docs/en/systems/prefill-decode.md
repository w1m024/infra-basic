# Prefill / Decode

Prefill and decode are the two most important stages in LLM inference systems. Most latency, throughput, KV cache, and scheduling issues must first be explained from these two stages.

## Two Stages

| Stage | Input | Output | Main Bottleneck |
|---|---|---|---|
| Prefill | prompt tokens | First forward pass, KV cache | Prompt length, attention computation, memory bandwidth |
| Decode | Previous generated token + KV cache | Next token | KV cache read, batch size, sampling, memory bandwidth |

## Key Metrics

| Metric | Meaning |
|---|---|
| TTFT | Time To First Token, mainly affected by queue, prefill, scheduling |
| TPOT / ITL | Time Per Output Token / Inter-Token Latency, mainly affected by decode loop |
| E2E latency | From request sent to all tokens completed |
| output tokens/s | decode throughput |
| total tokens/s | prefill + decode combined throughput |

## Common System Designs

- Long prompt workloads increase TTFT;
- Long output workloads amplify TPOT / ITL;
- Chunked prefill uses smaller token chunks to avoid long prompts blocking decode for extended periods;
- PD disaggregation places prefill and decode in different resource pools;
- Prefix cache / radix cache mainly improves prefill cost for repeated prefix scenarios.

## Pass Criteria

You can explain why short-prompt-long-output, long-prompt-short-output, and long-prompt-long-output have different bottlenecks.
