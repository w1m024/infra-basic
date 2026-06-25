# 项目

实践项目用于把 `infra-basic` 的概念落到代码、实验记录和结论中。完整项目说明仍维护在仓库根目录的 `projects/README.md`，本页作为文档站入口。

## 项目总览

| 项目 | 目标 | 对应阶段 |
|---|---|---|
| P0 Torch CUDA Inference Basics | 掌握 tensor / dtype / device / memory / profiler | PyTorch CUDA |
| P1 Operator and Kernel Basics | 理解 operator、kernel、Triton CUDA、PyTorch custom op | Operator / Kernel |
| P2 CUDA GPU Programming Basics | 理解 thread/block/grid、memory hierarchy、kernel launch | CUDA |
| P3 Naive Generation | 手写 autoregressive decoding | Transformers |
| P4 KV Cache Generation | 对比无 KV cache 与有 KV cache 的生成 | Transformers |
| P5 Toy LLM Server | 写一个很慢但可观测的 LLM server | Serving |
| P6 vLLM Lab | 跑通 vLLM server、benchmark 和源码笔记 | vLLM |
| P7 SGLang Lab | 跑通 SGLang server、structured output、prefix cache | SGLang |
| P8 Paper Reproduction Notes | 每篇论文复现一个关键现象 | Papers |
| P9 First OSS Contribution | 完成一个 issue reproduction / docs / test PR | Open source |

## 实验记录规范

```text
Date:
Commit:
Model:
GPU:
CUDA:
Driver:
Command:
Workload:
Metrics:
Profiler result:
Observation:
Next step:
```

## 源文件

详见仓库中的 `projects/README.md`。
