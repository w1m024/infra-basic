# Scheduler & Batching

The core of LLM serving systems is not HTTP, but the scheduler. The scheduler decides which requests enter model forward at each step, and how prefill / decode are mixed.

## Batching Modes

| Mode | Characteristics | Issues |
|---|---|---|
| Static batching | A group of requests start and end together | Severe waste when lengths vary |
| Dynamic batching | Merge requests within a short time window | Not sufficient for autoregressive decode |
| Continuous batching | Requests can be added/removed at each decode step | Mainstream serving engine approach |
| Chunked prefill | Long prompts scheduled in chunks | Reduces decode starvation |

## Scheduler Considerations

- Waiting / running request state transitions;
- Token budget per step;
- Prefill and decode priorities;
- Whether KV cache blocks are sufficient;
- Whether streaming requests return chunks timely;
- Whether speculative decoding brings additional tokens;
- Fairness, priority, timeout, cancellation.

## Source Reading Questions

1. When do requests transition from waiting to running;
2. How is the token budget calculated per step;
3. Whether prefill-heavy workloads block decode;
4. How to handle insufficient KV cache;
5. How state and cache are released after request completion.

## Pass Criteria

You can explain why continuous batching is more suitable for LLM serving than regular batching.
