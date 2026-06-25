# Benchmark 与 Profiling

Benchmark 的目标不是得到一个好看的 tokens/s，而是解释系统瓶颈。必须固定 workload、模型、硬件、版本和启动参数。

## 核心指标

| 指标 | 用途 |
|---|---|
| TTFT | 观察 queue / prefill / prefix cache |
| TPOT / ITL | 观察 decode token 间隔 |
| E2E latency | 用户感知总耗时 |
| requests/s | 请求吞吐 |
| output tokens/s | decode 吞吐 |
| total tokens/s | prefill + decode 综合吞吐 |
| GPU memory | 权重、KV cache、workspace、fragmentation |
| GPU utilization | 观察是否吃满计算或受调度 / client 限制 |

## Workload 设计

| workload | prompt | output | 目的 |
|---|---:|---:|---|
| short-short | 128 | 128 | baseline latency |
| short-long | 128 | 512 | decode pressure |
| long-short | 2048 | 128 | prefill / TTFT pressure |
| long-long | 2048 | 512 | mixed pressure |
| shared-prefix | long shared prefix | short output | prefix cache / radix cache |

## Profiler 顺序

```text
server metrics
→ benchmark client metrics
→ GPU memory / utilization
→ torch.profiler / Nsight Systems
→ Nsight Compute for specific kernel
```

## 通过标准

能说明一个 benchmark 数字是否可比，并指出瓶颈可能在 client、queue、prefill、decode、kernel、communication 还是 memory。
