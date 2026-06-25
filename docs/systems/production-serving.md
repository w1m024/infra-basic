# 生产级 Serving

生产 serving 关注的是长期稳定、高利用率和可观测，而不是单次 demo 能跑通。

## 生产系统关注点

| 方向 | 关键问题 |
|---|---|
| Routing | 请求按模型、长度、租户、SLO 分配 |
| Autoscaling | GPU worker 扩缩容、warmup、冷启动 |
| Admission control | 队列长度、超时、限流、优先级 |
| Observability | metrics、tracing、logs、GPU / KV cache 状态 |
| Reliability | worker crash、OOM、model reload、fallback |
| Rollout | 模型版本、灰度、A/B、回滚 |
| Cost | GPU utilization、batching efficiency、cache hit rate |

## 架构层次

```text
Gateway / API
→ router / admission control
→ serving engine workers
→ model runtime / kernels
→ metrics / tracing / logs
→ autoscaler / scheduler
```

## 代表系统

- Kubernetes + KServe / Ray Serve；
- Triton Inference Server；
- NVIDIA Dynamo；
- vLLM / SGLang distributed serving；
- cloud provider model serving platforms。

## 通过标准

能从生产角度解释为什么单机 benchmark 高不等于线上系统好，以及为什么 routing、observability、failure recovery 和 rollout 同样重要。
