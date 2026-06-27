# Transformers Hand-Written Generation Lab

## Goal

Understand how a request goes from text to tokens step by step. Master naive decoding, KV cache decoding, sampling, and the core concepts of prefill/decode.

## Suggested Models

Use small models to avoid environment issues masking learning goals:

- `Qwen/Qwen2.5-0.5B-Instruct`
- `Qwen/Qwen2.5-1.5B-Instruct`
- `TinyLlama/TinyLlama-1.1B-Chat-v1.0`

## Minimal Experiments

### 1. Run `model.generate()`

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "Qwen/Qwen2.5-0.5B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, device_map="cuda")

inputs = tokenizer("Hello, how are you?", return_tensors="pt").to("cuda")
outputs = model.generate(**inputs, max_new_tokens=32)
print(tokenizer.decode(outputs[0]))
```

### 2. Hand-written naive decoding loop

Don't use `model.generate()`, write greedy decoding by hand:

```python
input_ids = inputs.input_ids
for _ in range(32):
    logits = model(input_ids).logits[:, -1, :]
    next_token = logits.argmax(dim=-1, keepdim=True)
    input_ids = torch.cat([input_ids, next_token], dim=-1)
```

### 3. KV cache comparison

Compare naive decoding vs KV cache decoding in terms of latency and memory.

### 4. Sampling

Implement greedy / temperature / top-k / top-p, compare output differences.

## Deliverables

- `experiments/generate_naive.py`
- `experiments/generate_with_kv_cache.py`
- `experiments/sampling.py`
- A table: naive decoding vs KV cache decoding latency comparison

## Pass Criteria

Can explain:

1. Why longer prompts make prefill slower;
2. Why decode typically produces one token per step;
3. Why KV cache avoids redundant computation;
4. Why KV cache becomes a memory bottleneck.
