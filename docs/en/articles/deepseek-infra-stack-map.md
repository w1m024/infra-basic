# DeepSeek Infrastructure Stack

Coverage: FlashMLA, DeepGEMM, DeepEP, 3FS, with LMCache as cache reference.

## Layers

| Layer | Project | Focus |
|---|---|---|
| Attention | FlashMLA | MLA attention layout and decode/prefill kernel |
| GEMM | DeepGEMM | FP8 GEMM, grouped GEMM, tuning |
| Communication | DeepEP | Expert parallel dispatch/combine |
| Storage | 3FS | AI workload filesystem |
| Cache | LMCache | KV cache reuse/offload |

## Why This Is a System Collaboration Case

Model structure changes propagate pressure to kernels, communication, cache, and storage. DeepSeek-related projects are ideal for observing how model structure and system implementation jointly determine performance boundaries.

## Beginner Order

First read FlashMLA/DeepGEMM API and benchmarks, then read DeepEP dispatch/combine, finally use 3FS/LMCache as production boundary reference.
