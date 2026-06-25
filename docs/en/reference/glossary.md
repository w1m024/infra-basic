# Glossary

| Term | Meaning |
|---|---|
| TTFT | Time To First Token, latency to first generated token |
| TPOT | Time Per Output Token, average generation time per output token |
| Prefill | Processing prompt and generating initial KV cache stage |
| Decode | Autoregressive token-by-token generation stage |
| KV Cache | Attention key/value cache to reduce redundant computation |
| Continuous Batching | Batching strategy that continuously merges and schedules requests during generation |
| Paged Attention | Attention mechanism using paged block management for KV cache |
