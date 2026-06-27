# 一月计划

本文档给出 `infra-basic` 的一月学习计划。目标是在 4 周内完成 **LLM 推理基础设施的入门闭环**：能跑通小模型推理，理解 operator / kernel / CUDA/GPU 编程模型，完成 KV cache 实验，搭建 toy serving，跑通 vLLM 与 SGLang 的最小实验，并准备第一个开源贡献入口。

本计划默认使用 **CUDA-first / NVIDIA 标准环境**：

```text
Linux
→ NVIDIA GPU
→ NVIDIA Driver
→ CUDA Toolkit
→ PyTorch CUDA
→ Triton CUDA
→ vLLM / SGLang CUDA path
```

## 一个月够不够？

结论：

```text
够：完成入门闭环，建立主线概念，跑通最小实验，具备继续深入的方向感。
不够：深入掌握 vLLM / SGLang 核心调度、KV cache manager、attention backend、CUDA kernel 优化，或稳定提交核心模块 PR。
```

一个月结束时，合理目标不是“成为 vLLM / SGLang 专家”，而是：

1. 能解释 LLM 推理请求的基本路径；
2. 能解释 prefill、decode、KV cache、TTFT、TPOT；
3. 能用 PyTorch CUDA / Transformers 跑小模型；
4. 能用 profiler 看一次 forward 的主要 CUDA ops；
5. 能解释 thread、block、grid、warp、SM、global memory、shared memory、register；
6. 能写或跑通简单 Triton CUDA kernel；
7. 能写一个简单 toy server；
8. 能启动 vLLM / SGLang server；
9. 能做一个小 benchmark；
10. 能选择一个文档、example、issue reproduction 或 benchmark 作为开源入口。

## 时间投入假设

| 档位 | 每周投入 | 适合人群 | 一个月结果 |
|---|---:|---|---|
| 标准版 | 10-15 小时/周 | 有 Python 基础，刚进入 LLM infra | 完成主线实验，跑通 vLLM/SGLang，形成笔记 |
| 强化版 | 20-30 小时/周 | 时间更集中，能稳定使用 NVIDIA GPU | 完成更多 benchmark，并尝试 issue reproduction |

如果每周少于 8 小时，建议把本计划拉长到 6-8 周。

## 一个月总目标

```text
Week 1: PyTorch CUDA + Operator / Kernel + CUDA/GPU 编程模型
Week 2: Transformers 生成 + KV cache
Week 3: Toy serving + benchmark
Week 4: vLLM / SGLang CUDA path 最小闭环 + 开源贡献准备
```

## Week 1：PyTorch CUDA + Operator / Kernel + CUDA/GPU 编程模型

### 目标

建立 tensor、dtype、device、memory、profiler、operator、kernel、CUDA/GPU 编程模型的基本直觉。

### Day 1：CUDA 环境与 PyTorch 推理检查

任务：

- 确认 `nvidia-smi` 能看到 GPU；
- 确认 PyTorch CUDA 可用；
- 跑通 tensor 创建、CPU/GPU 拷贝、matmul；
- 记录不同 dtype 的显存差异；
- 理解为什么 GPU benchmark 要同步。

交付物：

```text
cuda_labs/00_check_cuda.py
experiments/torch_memory.py
reports/week1_cuda_torch_memory.md
```

最小检查脚本：

```python
import torch

print("torch:", torch.__version__)
print("cuda available:", torch.cuda.is_available())
if torch.cuda.is_available():
    print("device:", torch.cuda.get_device_name(0))
    print("capability:", torch.cuda.get_device_capability(0))
```

必须能解释：

- `float32`、`float16`、`bfloat16` 的显存差异；
- tensor 在 CPU 和 GPU 之间移动为什么有成本；
- 为什么 CUDA 操作经常是异步的；
- 为什么计时前后可能需要 `torch.cuda.synchronize()`。

### Day 2：Tensor layout

任务：

- 观察 `shape`、`stride`、`contiguous`；
- 对比 transpose 前后的 stride；
- 调用 `.contiguous()` 并观察是否产生复制。

交付物：

```text
operator_labs/tensor_layout.py
reports/week1_tensor_layout.md
```

必须能解释：

- shape 相同不代表内存布局相同；
- non-contiguous tensor 为什么可能影响 kernel；
- `.contiguous()` 为什么可能增加内存和拷贝。

### Day 3：Profiler 入门

任务：

- 用 `torch.profiler` profile 一次小模型 forward；
- 找 top CUDA ops；
- 区分 CPU time 和 CUDA time；
- 记录 kernel launch、matmul、attention、norm、copy 相关条目。

交付物：

```text
operator_labs/profile_forward.py
cuda_labs/05_torch_profiler_cuda.py
reports/week1_profile_forward.md
```

必须能解释：

- 一次 forward 里最耗时的是哪些算子；
- tokenizer 时间和 GPU forward 时间不能混在一起看；
- Python 慢、kernel launch 慢、CUDA kernel 本身慢是不同问题。

### Day 4：Operator / Kernel / CUDA 概念

任务：

- 阅读 [Operator / Kernel 入门](/reference/operator-kernel-guide)；
- 阅读 [CUDA GPU 入门](/reference/cuda-gpu-guide)；
- 写一页笔记解释 Python、operator、kernel、Triton、CUDA 的关系。

交付物：

```text
operator_labs/custom_op_notes.md
cuda_labs/README.md
reports/week1_operator_cuda_notes.md
```

必须能解释：

- operator 和 kernel 的区别；
- Python 调 `torch.matmul` 为什么不是 Python 自己做矩阵乘；
- CUDA 中 thread、block、grid、warp、SM 是什么；
- global memory、shared memory、register 的差异。

### Day 5-6：Triton CUDA 小实验

任务：

- 跑通 Triton vector add；
- 跑通 fused add + relu；
- 阅读或尝试 RMSNorm kernel；
- 对比 PyTorch 版本和 Triton 版本的耗时。

交付物：

```text
operator_labs/triton_vector_add.py
operator_labs/triton_fused_add_relu.py
operator_labs/triton_rmsnorm.py
reports/week1_triton_basics.md
```

不要求：

- 写高性能 matmul；
- 写 FlashAttention；
- 追求超过 PyTorch 官方 kernel。

### Day 7：CUDA C++ 最小阅读 / 可选实现

任务：

- 看懂 CUDA vector add；
- 可选：实现一个 `01_vector_add.cu`；
- 理解 kernel launch、block size、grid size、边界检查。

交付物：

```text
cuda_labs/01_vector_add.cu
reports/week1_cuda_vector_add.md
```

如果时间紧，Day 7 可以只阅读，不要求编译通过。

### Week 1 验收

完成后应该能回答：

1. PyTorch tensor op 和 Python for-loop 的性能差异来自哪里？
2. operator 和 kernel 的区别是什么？
3. 什么是 shape、stride、contiguous？
4. 为什么 profiler 是写 kernel 前必须会的工具？
5. thread、block、grid、warp、SM 的关系是什么？
6. Triton 和 CUDA C++ 分别适合什么阶段？

## Week 2：Transformers 生成 + KV Cache

### 目标

理解文本生成的完整路径：tokenizer、logits、sampling、autoregressive decoding、prefill、decode、KV cache。

### Day 8：跑通小模型生成

建议模型：

- `Qwen/Qwen2.5-0.5B-Instruct`
- `Qwen/Qwen2.5-1.5B-Instruct`
- `TinyLlama/TinyLlama-1.1B-Chat-v1.0`

任务：

- 用 Transformers 跑通 `model.generate()`；
- 打印 input token 数、output token 数、耗时；
- 记录 CUDA 显存。

交付物：

```text
experiments/generate_hf.py
reports/week2_generate_hf.md
```

### Day 9-10：手写 naive decoding

任务：

- 不使用 `model.generate()`；
- 手写 greedy decoding loop；
- 只取最后一个 token 的 logits；
- 每步拼接新 token。

交付物：

```text
experiments/generate_naive.py
reports/week2_naive_decoding.md
```

必须能解释：

- logits 是什么；
- 为什么取最后一个 token 的 logits；
- 为什么每生成一个 token 都要 forward。

### Day 11：Sampling

任务：

- 实现 greedy；
- 实现 temperature；
- 实现 top-k；
- 实现 top-p；
- 对比输出差异。

交付物：

```text
experiments/sampling.py
reports/week2_sampling.md
```

### Day 12-13：KV Cache

任务：

- 使用 `past_key_values` 或模型 cache 机制；
- 对比 naive decoding 与 KV cache decoding；
- 记录 TTFT、TPOT、显存峰值；
- 测 prompt length 128 / 1024 / 4096。

交付物：

```text
experiments/generate_with_kv_cache.py
experiments/kv_cache_memory.py
reports/week2_kv_cache.md
```

报告表格：

| prompt tokens | output tokens | cache | TTFT | TPOT | peak memory | notes |
|---:|---:|---|---:|---:|---:|---|
| 128 | 128 | off | | | | |
| 128 | 128 | on | | | | |
| 1024 | 128 | off | | | | |
| 1024 | 128 | on | | | | |
| 4096 | 128 | on | | | | |

### Day 14：论文轻读

只读主线，不做数学细节：

1. Attention Is All You Need：attention 和 Transformer block；
2. FlashAttention：为什么 attention 受 IO / memory 影响；
3. PagedAttention：KV cache 为什么需要分页管理。

交付物：

```text
notes/paper_notes/week2_paper_notes.md
```

### Week 2 验收

完成后应该能回答：

1. prefill 和 decode 的区别是什么？
2. KV cache 为什么能省计算？
3. KV cache 为什么会占显存？
4. TTFT 和 TPOT 分别受什么影响？
5. 为什么长 prompt 和长 output 的瓶颈不同？
6. attention 和 KV cache 为什么会受 GPU memory bandwidth 影响？

## Week 3：Toy Serving + Benchmark

### 目标

写一个很慢但可观测的 LLM server，并用它理解 vLLM / SGLang 的必要性。

### Day 15-16：非流式 toy server

任务：

- 用 FastAPI 或类似框架写 `/v1/chat/completions`；
- 接收 messages；
- 拼 prompt；
- 调用 Transformers 生成；
- 返回 OpenAI-compatible 风格的响应。

交付物：

```text
toy_server/server.py
toy_server/client.py
reports/week3_toy_server_basic.md
```

### Day 17：Streaming

任务：

- 支持 streaming；
- 记录首 token 返回时间；
- 记录 token chunk 间隔；
- 比较 streaming 和 non-streaming。

交付物：

```text
toy_server/client_streaming.py
reports/week3_streaming.md
```

必须能解释：

- TTFT 和 E2E latency 的区别；
- streaming 为什么改变 server/client 设计；
- client 不读取 streaming response 可能造成什么问题。

### Day 18-19：Benchmark

任务：

- 写 benchmark 脚本；
- 测并发 1 / 2 / 4 / 8；
- 测 short-short、short-long、long-short、long-long；
- 记录 TTFT、TPOT、E2E latency、tokens/s、显存、GPU utilization。

交付物：

```text
benchmarks/benchmark_toy_server.py
reports/week3_toy_benchmark.md
```

workload 表：

| workload | prompt | output | 目的 |
|---|---:|---:|---|
| short-short | 128 | 128 | 基础延迟 |
| short-long | 128 | 512 | decode 压力 |
| long-short | 2048 | 128 | prefill / TTFT 压力 |
| long-long | 2048 | 512 | 综合压力 |

### Day 20：问题复盘

写一页说明 toy server 为什么不适合高并发 serving。

必须覆盖：

- 每个请求独立 `generate()` 的问题；
- request-level batching 为什么不够；
- 不同长度请求为什么难调度；
- KV cache 为什么需要统一管理；
- 为什么需要 continuous batching；
- 为什么需要 vLLM / SGLang。

交付物：

```text
reports/week3_why_serving_engine.md
```

### Day 21：论文轻读

阅读：

1. Orca：iteration-level scheduling / continuous batching；
2. PagedAttention：KV cache block 管理；
3. SGLang：RadixAttention 和 structured program。

交付物：

```text
notes/paper_notes/week3_serving_papers.md
```

### Week 3 验收

完成后应该能回答：

1. 为什么普通 FastAPI + `model.generate()` 不够？
2. continuous batching 和普通 batching 的区别是什么？
3. 什么 workload 会让 TTFT 高？
4. 什么 workload 会让 TPOT 高？
5. 为什么 vLLM / SGLang 的核心不是 HTTP，而是调度和 KV cache 管理？

## Week 4：vLLM / SGLang CUDA path 最小闭环 + 开源贡献准备

### 目标

跑通 vLLM 和 SGLang 的最小实验，做一次对比 benchmark，并准备第一个可执行的开源贡献入口。

### Day 22-23：vLLM 最小闭环

任务：

- 启动 vLLM OpenAI-compatible server；
- 用 OpenAI client 请求；
- 测 streaming；
- 测不同 `max_model_len` 或 `gpu_memory_utilization`；
- 记录日志、显存和 profiler 观察。

交付物：

```text
vllm_labs/run_server.sh
vllm_labs/client_openai.py
vllm_labs/client_streaming.py
vllm_labs/benchmark_report.md
```

源码笔记最小范围：

```text
API server
→ engine
→ scheduler
→ KV cache manager
→ model runner
→ attention backend
→ CUDA / Triton kernel
```

交付物：

```text
vllm_labs/source_notes.md
vllm_labs/attention_backend_notes.md
```

### Day 24-25：SGLang 最小闭环

任务：

- 启动 SGLang OpenAI-compatible server；
- 用 OpenAI client 请求；
- 跑 streaming；
- 跑 structured output；
- 做一次共享 prefix 与不共享 prefix 对比。

交付物：

```text
sglang_labs/run_server.sh
sglang_labs/client_openai.py
sglang_labs/client_streaming.py
sglang_labs/structured_output.py
sglang_labs/radix_cache_benchmark.py
```

源码笔记最小范围：

```text
server entrypoint
→ runtime / scheduler
→ memory pool
→ radix cache
→ structured output decoding
→ CUDA / Triton kernel boundary
```

交付物：

```text
sglang_labs/source_notes.md
sglang_labs/kernel_runtime_notes.md
```

### Day 26：vLLM vs SGLang 对比

用同一个模型、同一类 workload 做小对比。

必须固定：

- model；
- GPU；
- CUDA / driver；
- dtype；
- prompt tokens；
- output tokens；
- concurrency；
- streaming 与否；
- 是否 prefix cache / radix cache。

交付物：

```text
reports/week4_vllm_sglang_comparison.md
```

报告表格：

| framework | workload | concurrency | TTFT | TPOT | output tokens/s | peak memory | notes |
|---|---|---:|---:|---:|---:|---:|---|
| vLLM | short-short | 1 | | | | | |
| vLLM | long-short | 4 | | | | | |
| SGLang | short-short | 1 | | | | | |
| SGLang | shared-prefix | 4 | | | | | |

### Day 27：开源 issue 筛选

目标不是马上改核心代码，而是找一个可完成入口。

候选类型：

- 文档命令过期；
- example 不够最小；
- CUDA 环境说明不清楚；
- benchmark 步骤不完整；
- attention backend 文档缺少最小解释；
- issue 缺少最小复现。

交付物：

```text
notes/oss/issue_candidates.md
```

记录模板：

```text
Project:
Issue / PR link:
Type: docs / example / reproduction / benchmark / test
Why suitable:
Required environment:
Minimal reproduction idea:
Risk:
Next action:
```

### Day 28：准备 first contribution

选择一个最小任务，完成以下之一：

1. 写一个文档修复草稿；
2. 写一个 example 草稿；
3. 写一个 issue reproduction；
4. 写一个 benchmark reproduction；
5. 写一个 regression test 草稿。

交付物：

```text
notes/oss/first_contribution_plan.md
```

### Week 4 验收

完成后应该能回答：

1. vLLM 请求主路径是什么？
2. SGLang 请求主路径是什么？
3. vLLM 和 SGLang 各自更强调什么？
4. prefix cache / radix cache 对 TTFT 还是 TPOT 影响更明显？
5. attention backend 和 CUDA/Triton kernel 在请求路径中处于什么位置？
6. 第一个开源贡献应该选什么类型？为什么？

## 每日节奏建议

如果每天有 1.5-2 小时：

```text
30 分钟：读文档 / 论文 / 源码入口
60 分钟：写代码 / 跑实验
20 分钟：记录日志和结论
10 分钟：整理第二天任务
```

如果每天有 3-4 小时：

```text
45 分钟：阅读
90-120 分钟：实验
45 分钟：benchmark / debug / profiler
30 分钟：写报告 / 笔记
```

## 一个月内不建议做的事

不要做：

- 从零完整啃 CUDA Programming Guide；
- 手写 FlashAttention；
- 深入 CUTLASS / CuTe；
- 大改 vLLM scheduler；
- 大改 SGLang runtime；
- 多机分布式 serving；
- Kubernetes 生产部署；
- MoE expert parallel 深入；
- 同时研究太多框架。

这些内容可以作为第二个月之后的方向。

## 一个月后的合理状态

一个月后，合理状态是：

```text
你不是专家，但已经不是纯新手。
你能跑、能测、能解释、能定位入口、能写最小复现。
```

应该已经具备：

- 阅读 vLLM / SGLang issue 的基本能力；
- 判断问题属于环境、模型、参数、workload 还是框架的初步能力；
- 写最小复现脚本的能力；
- 做简单 benchmark 的能力；
- 解释基础 CUDA/GPU 编程模型的能力；
- 继续深入 scheduler、KV cache、attention backend、Triton/CUDA 的方向感。

## 第二个月建议方向

根据兴趣选择一条，不要全选。

| 方向 | 适合目标 |
|---|---|
| vLLM scheduler / KV cache | 想深入通用 serving engine |
| SGLang radix cache / structured output | 想深入复杂 LLM program runtime |
| Triton / CUDA / attention backend | 想做底层性能优化 |
| benchmark / profiling | 想做性能分析和复现 |
| docs / examples / tests | 想尽快参与开源贡献 |

## 最小完成版

如果时间不够，只完成这些：

```text
1. PyTorch CUDA dtype / memory / profiler
2. tensor layout: shape / stride / contiguous
3. CUDA/GPU 编程模型：thread / block / grid / memory hierarchy
4. Triton vector add 或 fused add + relu
5. Transformers naive decoding
6. KV cache 对比实验
7. toy server non-streaming + benchmark
8. vLLM server + client
9. SGLang server + structured output
10. 一个 issue reproduction 或 first contribution plan
```

这 10 项完成后，一个月计划就算达标。