# 问题排查指南

本文档记录学习 LLM 推理基础设施时常见的问题。目标不是罗列所有错误，而是给出排查顺序。

## 排查总原则

遇到问题时，不要直接换框架、换模型或重装环境。按下面顺序缩小范围：

```text
确认现象
→ 固定版本
→ 降低变量
→ 换最小模型
→ 写最小复现
→ 记录日志
→ 判断是环境 / 参数 / 模型 / workload / 框架问题
```

每次排查都记录：

- OS；
- Python version；
- CUDA / driver；
- GPU 型号与显存；
- PyTorch version；
- Transformers version；
- vLLM / SGLang version 或 commit；
- 模型名称；
- 完整启动命令；
- 完整请求 payload；
- 完整报错日志。

## 1. CUDA / PyTorch 类问题

### 现象：`torch.cuda.is_available()` 是 False

优先检查：

1. 是否安装了 GPU 版 PyTorch；
2. NVIDIA driver 是否正常；
3. `nvidia-smi` 是否能看到 GPU；
4. CUDA runtime 与 PyTorch wheel 是否匹配；
5. 是否在错误的虚拟环境中运行。

最小检查脚本：

```python
import torch

print("torch:", torch.__version__)
print("cuda available:", torch.cuda.is_available())
print("cuda version:", torch.version.cuda)
if torch.cuda.is_available():
    print("device:", torch.cuda.get_device_name(0))
```

### 现象：PyTorch 能看到 GPU，但推理很慢

优先检查：

1. 模型和 input tensor 是否真的在 GPU 上；
2. 是否忘了 `model.eval()`；
3. 是否忘了 `torch.no_grad()` 或 `torch.inference_mode()`；
4. batch 是否过小导致 GPU 利用率低；
5. 是否频繁 CPU/GPU 拷贝；
6. 是否把 tokenizer 时间算进模型 forward 时间。

## 2. 显存 OOM

### 现象：加载模型时 OOM

优先检查：

1. 模型参数量是否超过显存；
2. dtype 是否是 fp32；
3. 是否可以使用 fp16 / bf16；
4. 是否有其他进程占显存；
5. 是否需要更小模型或量化模型。

处理顺序：

```text
换 0.5B/1.5B 模型
→ 使用 bf16/fp16
→ 降低 max_model_len
→ 降低 batch/concurrency
→ 使用量化
→ 换更大显存 GPU
```

### 现象：启动 server 时 OOM

vLLM / SGLang serving 不是只加载权重，还会为 KV cache、workspace、CUDA graph、临时 buffer 预留显存。

优先检查：

1. `max_model_len` 是否过大；
2. `gpu_memory_utilization` 是否过高；
3. 并发或 batch token 上限是否过高；
4. prefix cache / radix cache 是否增加显存压力；
5. 是否有其他进程占用显存。

### 现象：运行一段时间后 OOM

优先检查：

1. 请求是否有极长 prompt；
2. 输出是否无限接近 `max_tokens`；
3. client 是否没有读取 streaming response；
4. 请求结束后资源是否释放；
5. 是否存在 memory leak；
6. benchmark 是否不断增加并发但没有等待完成。

## 3. Tokenizer / Chat Template 问题

### 现象：模型输出很怪

优先检查：

1. 是否使用了正确的 chat template；
2. instruct 模型是否按 messages 格式输入；
3. base model 是否被当成 chat model 使用；
4. system / user / assistant role 是否正确；
5. 是否重复添加 BOS/EOS token。

### 现象：相同文本 prefix cache 没命中

可能原因：

1. chat template 生成的 token 序列不同；
2. 空格、换行、特殊 token 不同；
3. system prompt 看起来相同但实际字符串不同；
4. tokenizer 版本不同；
5. 请求中包含时间戳、随机 ID 等动态字段。

排查方法：

```python
ids1 = tokenizer(prompt1).input_ids
ids2 = tokenizer(prompt2).input_ids
print(ids1[:100])
print(ids2[:100])
print(ids1 == ids2)
```

## 4. Generation 结果问题

### 现象：输出重复、发散或很短

优先检查：

1. `temperature`；
2. `top_p`；
3. `top_k`；
4. `max_tokens`；
5. stop tokens；
6. repetition penalty；
7. chat template；
8. 模型本身是否适合该任务。

### 现象：JSON 输出不合法

不要只靠 prompt 要求“输出 JSON”。优先考虑：

1. 使用 structured output / constrained decoding；
2. 简化 schema；
3. 降低 temperature；
4. 增加 max tokens；
5. 检查 stop token 是否截断 JSON；
6. 将复杂 schema 拆成多步生成。

## 5. Benchmark 结果异常

### 现象：吞吐比别人低很多

先确认是否可比：

| 变量 | 是否一致 |
|---|---|
| 模型 | |
| GPU | |
| CUDA / driver | |
| 框架版本 / commit | |
| dtype | |
| quantization | |
| prompt token 分布 | |
| output token 分布 | |
| concurrency | |
| streaming | |
| prefix cache | |
| max model len | |
| max batched tokens | |

常见原因：

1. 你测的是 long-prefill，别人测的是 short prompt；
2. 你把 tokenizer/client 时间算进去了；
3. client 机器压测能力不足；
4. 网络延迟被计入；
5. batch token 参数不一致；
6. 未启用同样的优化特性；
7. GPU 被其他进程共享。

### 现象：TTFT 很高

优先检查：

1. prompt 是否过长；
2. 是否有 prefix cache miss；
3. prefill 是否被其他请求阻塞；
4. 并发是否过高；
5. max batched tokens 是否限制了 prefill；
6. 是否用了复杂 structured output。

### 现象：TPOT / ITL 很高

优先检查：

1. batch 是否太小；
2. GPU utilization 是否低；
3. decode 阶段是否受 memory bandwidth 限制；
4. 是否启用了低效后端；
5. 是否使用了复杂采样或约束；
6. 是否被 CPU 后处理拖慢。

## 6. vLLM 常见问题

### 启动失败

检查：

1. 模型是否支持当前 vLLM 版本；
2. 架构是否被支持；
3. dtype 是否被支持；
4. attention backend 是否支持该模型；
5. `max_model_len` 是否超过模型或显存可承受范围；
6. 是否需要 `trust_remote_code`。

### 请求失败

检查：

1. server 是否完全启动完成；
2. client base URL 是否为 `/v1`；
3. model 字段是否正确；
4. payload 是否符合 OpenAI-compatible API；
5. streaming client 是否正确处理 SSE/chunk。

### prefix cache 没有效果

检查：

1. 是否启用 prefix caching；
2. token prefix 是否真正相同；
3. 是否被 eviction；
4. workload 是否主要是 decode-heavy；
5. 是否只看了 output tokens/s，而不是 TTFT。

## 7. SGLang 常见问题

### structured output 失败

检查：

1. schema 是否有效；
2. regex / grammar 是否过复杂；
3. max tokens 是否太小；
4. stop token 是否过早截断；
5. temperature 是否过高；
6. 字段 enum 是否过大。

### radix cache 没收益

检查：

1. token prefix 是否相同；
2. chat template 是否一致；
3. 是否有动态字段污染前缀；
4. cache 是否被 eviction；
5. benchmark 是否没有复用场景。

### OpenAI client 请求失败

检查：

1. base URL 是否指向 `/v1`；
2. server port 是否正确；
3. model 名称是否匹配；
4. request body 是否包含不支持的字段；
5. server 日志中是否有 schema / tokenizer / backend 报错。

## 8. Issue Reproduction 模板

向 vLLM / SGLang 提 issue 或回复 issue 时，建议使用：

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

## 9. 不建议的排查方式

不要：

- 一报错就重装所有依赖；
- 同时改模型、参数、框架版本、CUDA 版本；
- 没有记录 commit 和命令；
- 用超大模型做初次复现；
- 只贴截图不贴文本日志；
- benchmark 不写 workload 分布。

建议：

```text
小模型
→ 单请求
→ 固定参数
→ 固定版本
→ 最小脚本
→ 清晰日志
→ 再逐步放大 workload
```
