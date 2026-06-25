# Benchmark & Profiling

The goal of benchmarking is not to get a nice tokens/s number, but to explain system bottlenecks. You must fix workload, model, hardware, version, and launch parameters.

## Core Metrics

| Metric | Purpose |
|---|---|
| TTFT | Observe queue / prefill / prefix cache |
| TPOT / ITL | Observe decode token interval |
| E2E latency | User-perceived total time |
| requests/s | Request throughput |
| output tokens/s | decode throughput |
| total tokens/s | prefill + decode combined throughput |
| GPU memory | Weights, KV cache, workspace, fragmentation |
| GPU utilization | Observe whether compute is saturated or limited by scheduling / client |

## Workload Design

| Workload | Prompt | Output | Purpose |
|---|---:|---:|---|
| short-short | 128 | 128 | baseline latency |
| short-long | 128 | 512 | decode pressure |
| long-short | 2048 | 128 | prefill / TTFT pressure |
| long-long | 2048 | 512 | mixed pressure |
| shared-prefix | long shared prefix | short output | prefix cache / radix cache |

## Profiler Order

```text
server metrics
→ benchmark client metrics
→ GPU memory / utilization
→ torch.profiler / Nsight Systems
→ Nsight Compute for specific kernel
```

## Pass Criteria

You can explain whether a benchmark number is comparable, and identify whether the bottleneck is in client, queue, prefill, decode, kernel, communication, or memory.
