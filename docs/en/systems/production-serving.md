# Production Serving

Production serving focuses on long-term stability, high utilization, and observability, not just a single demo running successfully.

## Production System Concerns

| Direction | Key Issues |
|---|---|
| Routing | Request distribution by model, length, tenant, SLO |
| Autoscaling | GPU worker scaling, warmup, cold start |
| Admission control | Queue length, timeout, rate limiting, priority |
| Observability | metrics, tracing, logs, GPU / KV cache status |
| Reliability | worker crash, OOM, model reload, fallback |
| Rollout | Model versioning, canary, A/B, rollback |
| Cost | GPU utilization, batching efficiency, cache hit rate |

## Architecture Layers

```text
Gateway / API
→ router / admission control
→ serving engine workers
→ model runtime / kernels
→ metrics / tracing / logs
→ autoscaler / scheduler
```

## Representative Systems

- Kubernetes + KServe / Ray Serve;
- Triton Inference Server;
- NVIDIA Dynamo;
- vLLM / SGLang distributed serving;
- Cloud provider model serving platforms.

## Pass Criteria

You can explain from a production perspective why high single-machine benchmark doesn't equal good online system performance, and why routing, observability, failure recovery, and rollout are equally important.
