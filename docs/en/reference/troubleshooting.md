# Troubleshooting Guide

This document records common problems when learning LLM inference infrastructure. The goal is not to list all errors, but to provide a troubleshooting order.

## General Principles

When encountering problems, don't immediately switch frameworks, models, or reinstall environments. Narrow the scope in this order:

```text
Confirm symptoms
→ Fix versions
→ Reduce variables
→ Switch to smallest model
→ Write minimal reproduction
→ Record logs
→ Determine if it's environment / parameters / model / workload / framework issue
```

Record for each troubleshooting:

- OS
- Python version
- CUDA / driver
- GPU model and memory
- PyTorch version
- Transformers version
- vLLM / SGLang version or commit
- Model name
- Full launch command
- Full request payload
- Full error log

## 1. CUDA / PyTorch Issues

### Symptom: `torch.cuda.is_available()` returns False

Check in order:

1. Is GPU version of PyTorch installed?
2. Is NVIDIA driver working?
3. Can `nvidia-smi` see the GPU?
4. Does CUDA runtime match PyTorch wheel?
5. Are you running in the wrong virtual environment?

### Symptom: PyTorch sees GPU but inference is slow

Check in order:

1. Are model and input tensor actually on GPU?
2. Did you forget `model.eval()`?
3. Did you forget `torch.no_grad()` or `torch.inference_mode()`?
4. Is batch too small causing low GPU utilization?
5. Are there frequent CPU/GPU copies?
6. Are you counting tokenizer time as model forward time?

## 2. Out of Memory

### Symptom: OOM when loading model

Check in order:

1. Does model parameters exceed GPU memory?
2. Is dtype fp32?
3. Can you use fp16 / bf16?
4. Are other processes using GPU memory?
5. Do you need a smaller or quantized model?

Processing order:

```text
Switch to 0.5B/1.5B model
→ Use bf16/fp16
→ Reduce max_model_len
→ Reduce batch/concurrency
→ Use quantization
→ Switch to larger GPU
```

### Symptom: OOM when starting server

vLLM / SGLang serving doesn't just load weights - it also reserves memory for KV cache, workspace, CUDA graph, and temporary buffers.

Check in order:

1. Is `max_model_len` too large?
2. Is `gpu_memory_utilization` too high?
3. Are concurrency or batch token limits too high?
4. Is prefix cache / radix cache increasing memory pressure?
5. Are other processes using GPU memory?

## 3. Tokenizer / Chat Template Issues

### Symptom: Model output looks wrong

Check in order:

1. Are you using the correct chat template?
2. Are instruct models input in messages format?
3. Is base model being used as chat model?
4. Are system / user / assistant roles correct?
5. Are you repeatedly adding BOS/EOS tokens?

## 4. Generation Result Issues

### Symptom: Output is repetitive, divergent, or very short

Check in order:

1. `temperature`
2. `top_p`
3. `top_k`
4. `max_tokens`
5. Stop tokens
6. Repetition penalty
7. Chat template
8. Whether the model is suitable for the task

### Symptom: JSON output is invalid

Don't just rely on prompt to "output JSON". Consider:

1. Use structured output / constrained decoding
2. Simplify schema
3. Lower temperature
4. Increase max tokens
5. Check if stop token truncates JSON
6. Split complex schema into multi-step generation

## 5. Benchmark Result Anomalies

### Symptom: Throughput much lower than others

First confirm comparability:

| Variable | Consistent? |
|---|---|
| Model | |
| GPU | |
| CUDA / driver | |
| Framework version / commit | |
| dtype | |
| quantization | |
| Prompt token distribution | |
| Output token distribution | |
| Concurrency | |
| streaming | |
| prefix cache | |

Common causes:

1. You tested long-prefill, others tested short prompt
2. You included tokenizer/client time
3. Client machine insufficient for load testing
4. Network latency counted
5. Inconsistent batch token parameters
6. Same optimizations not enabled
7. GPU shared with other processes

## 6. vLLM Common Issues

### Startup failure

Check:

1. Does model support current vLLM version?
2. Is architecture supported?
3. Is dtype supported?
4. Does attention backend support this model?
5. Does `max_model_len` exceed model or memory capacity?
6. Is `trust_remote_code` needed?

### Request failure

Check:

1. Is server fully started?
2. Is client base URL `/v1`?
3. Is model field correct?
4. Does payload conform to OpenAI-compatible API?
5. Does streaming client handle SSE/chunks correctly?

## 7. SGLang Common Issues

### Structured output failure

Check:

1. Is schema valid?
2. Is regex / grammar too complex?
3. Are max tokens too small?
4. Is stop token truncating too early?
5. Is temperature too high?
6. Are field enums too large?

## 8. Issue Reproduction Template

When submitting issues to vLLM / SGLang, use:

```markdown
## Environment

- OS:
- GPU:
- Driver:
- CUDA:
- Python:
- PyTorch:
- vLLM/SGLang version or commit:
- Model:

## Command

```bash
# exact command
```

## Request

```json
{
  "model": "...",
  "messages": [...],
  "max_tokens": 128
}
```

## Expected behavior

...

## Actual behavior

...

## Logs

```text
...
```

## Minimal reproduction

```python
...
```
```
