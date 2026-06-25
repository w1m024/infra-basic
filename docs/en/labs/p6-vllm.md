# P6 vLLM Lab

## Goal

Run vLLM minimal service and connect lab results to vLLM source reading.

## Commands

```bash
git submodule update --init --depth 1 vendor/vllm-project/vllm
```

Start an OpenAI-compatible server in a CUDA environment supported by vLLM, and record TTFT, TPOT, tokens/s, and memory usage.

## Pass Criteria

You can explain the relationship between API server, engine, scheduler, worker, and KV cache manager during a single request.
