# P5 Toy Serving Lab

## Goal

Understand the relationship between requests, streaming, concurrency, and benchmarks using a minimal HTTP server.

## Minimal Experiment

```bash
python projects/toy-serving/server.py
```

If the project script is not yet implemented, write a mock server using FastAPI or standard library HTTP server that returns a token sequence.

## Pass Criteria

- You can distinguish TTFT, TPOT, E2E latency.
- You can explain when streaming responses flush.
- You can record how concurrency changes affect latency.
