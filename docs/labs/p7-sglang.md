# P7 SGLang 实验

## 目标

跑通 SGLang 最小服务，并把实验结果连接到 [SGLang 源码阅读](/source-reading/serving/sglang)。

## 学习计划

详细学习计划见 [SGLang 学习计划](/source-reading/serving/sglang-study-plan)。

## 命令

```bash
git submodule update --init --depth 1 vendor/sgl-project/sglang
```

在 SGLang 支持的 CUDA 环境中启动 server，记录 TTFT、TPOT、tokens/s、prefix cache 行为。

## 通过标准

能说明 runtime、scheduler、RadixAttention/prefix cache 和 model runner 的关系。
