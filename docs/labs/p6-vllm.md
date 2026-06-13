# P6 vLLM 实验

## 目标

跑通 vLLM 最小服务，并把实验结果连接到 [vLLM 源码阅读](/source-reading/serving/vllm)。

## 命令

```bash
git submodule update --init --depth 1 vendor/vllm-project/vllm
```

在 vLLM 支持的 CUDA 环境中启动 OpenAI-compatible server，并记录 TTFT、TPOT、tokens/s 与显存。

## 通过标准

能说明 API server、engine、scheduler、worker、KV cache manager 在一次请求中的关系。
