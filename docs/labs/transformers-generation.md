# Transformers 手写生成实验

## 目标

理解一个请求如何从文本变成 token，再一步步生成输出。掌握 naive decoding、KV cache decoding、sampling 和 prefill/decode 的核心概念。

## 建议模型

优先使用小模型，避免环境问题掩盖学习目标：

- `Qwen/Qwen2.5-0.5B-Instruct`
- `Qwen/Qwen2.5-1.5B-Instruct`
- `TinyLlama/TinyLlama-1.1B-Chat-v1.0`

## 最小实验

### 1. 跑通 `model.generate()`

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "Qwen/Qwen2.5-0.5B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, device_map="cuda")

inputs = tokenizer("Hello, how are you?", return_tensors="pt").to("cuda")
outputs = model.generate(**inputs, max_new_tokens=32)
print(tokenizer.decode(outputs[0]))
```

### 2. 手写 naive decoding loop

不使用 `model.generate()`，手写 greedy decoding：

```python
input_ids = inputs.input_ids
for _ in range(32):
    logits = model(input_ids).logits[:, -1, :]
    next_token = logits.argmax(dim=-1, keepdim=True)
    input_ids = torch.cat([input_ids, next_token], dim=-1)
```

### 3. KV cache 对比

对比 naive decoding 与使用 KV cache 的 decoding 耗时和显存差异。

### 4. Sampling

实现 greedy / temperature / top-k / top-p，对比输出差异。

## 交付物

- `experiments/generate_naive.py`
- `experiments/generate_with_kv_cache.py`
- `experiments/sampling.py`
- 一张表：naive decoding 与 KV cache decoding 的耗时对比

## 通过标准

能解释：

1. prompt 越长，prefill 为什么越慢；
2. decode 为什么通常一个 token 一个 step；
3. KV cache 为什么能避免重复计算；
4. KV cache 为什么又会成为显存瓶颈。
