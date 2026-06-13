# 从 vendor/ 到源码文章：如何系统阅读 LLM Infra 项目

`vendor/` 不是收藏夹。它的作用是把源码阅读文章锚定到一个可复现的 checkout：路径、commit、入口文件和实验命令都必须能回到本地 submodule。

## 阅读顺序

1. Serving：先读 vLLM、SGLang、TensorRT-LLM，建立请求入口、scheduler、KV cache、worker、streaming 的主线。
2. Kernel：再读 FlashInfer、FlashAttention、CUTLASS、Triton，理解 serving engine 调用 backend 的边界。
3. Distributed：补 DeepEP、Triton Server、Dynamo、LMCache，关注通信、cache、部署和观测。
4. Agent：最后读 Codex、Gemini CLI、Aider、OpenHands、SWE-agent，对照 tool loop、sandbox、edit 和 verification。

## 固定方法

每个项目都按同一张表读：

| 维度 | 问题 |
|---|---|
| 入口 | 请求、命令或 API 从哪里进入？ |
| 状态 | request/cache/runtime/tool state 由谁创建？ |
| 循环 | schedule/execute/stream 或 model/tool/verify 如何循环？ |
| 资源 | cache、GPU memory、process、sandbox 如何释放？ |
| 边界 | 哪些部分是后端、driver、外部服务或模型负责？ |
| 指标 | TTFT、TPOT、tokens/s、trace、trajectory 在哪里记录？ |

## 记录 commit 和路径

```bash
git submodule update --init --depth 1 vendor/vllm-project/vllm
git -C vendor/vllm-project/vllm rev-parse --short HEAD
```

文章里的源码路径必须来自当前 checkout。遇到路径变化，先修文章，再更新 manifest。

## 避免陷入细节

不要从 kernel 内层或类型系统开始。先画主路径图，再补关键状态对象，最后才读优化分支。
