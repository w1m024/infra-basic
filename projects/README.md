# Projects

本目录定义 `infra-basic` 的实践项目。每个项目都应该产出代码、实验记录和简短结论。

本项目集默认使用 **CUDA-first / NVIDIA 标准环境**：

```text
Linux
→ NVIDIA GPU
→ NVIDIA Driver
→ CUDA Toolkit
→ PyTorch CUDA
→ Triton CUDA
→ vLLM / SGLang CUDA path
```

非 CUDA 后端、AMD/ROCm、国产硬件、Paddle custom device 等只作为扩展方向，不作为本项目集主线。

## 项目总览

| 项目 | 目标 | 难度 | 对应阶段 |
|---|---|---:|---|
| P0 Torch CUDA Inference Basics | 掌握 tensor / dtype / device / memory / profiler | 1 | PyTorch CUDA |
| P1 Operator and Kernel Basics | 理解 operator、kernel、Triton CUDA、PyTorch custom op | 2 | Operator / Kernel |
| P2 CUDA GPU Programming Basics | 理解 thread/block/grid、memory hierarchy、kernel launch | 3 | CUDA |
| P3 Naive Generation | 手写 autoregressive decoding | 2 | Transformers |
| P4 KV Cache Generation | 对比无 KV cache 与有 KV cache 的生成 | 2 | Transformers |
| P5 Toy LLM Server | 写一个很慢但可观测的 LLM server | 3 | Serving |
| P6 vLLM Lab | 跑通 vLLM server、benchmark 和源码笔记 | 4 | vLLM |
| P7 SGLang Lab | 跑通 SGLang server、structured output、prefix cache | 4 | SGLang |
| P8 Paper Reproduction Notes | 每篇论文复现一个关键现象 | 4 | Papers |
| P9 First OSS Contribution | 完成一个 issue reproduction / docs / test PR | 5 | Open source |

## P0. Torch CUDA Inference Basics

### 目标

理解推理阶段最常见的底层问题：dtype、device、batch、显存、CUDA async execution 和 profiling。

### 需要实现

```text
experiments/torch_memory.py
experiments/matmul_benchmark.py
experiments/profiler_demo.py
cuda_labs/00_check_cuda.py
```

### 必做实验

1. 检查 `nvidia-smi` 和 `torch.cuda.is_available()`；
2. 比较 fp32 / fp16 / bf16 tensor 显存；
3. 比较 CPU / GPU matmul 耗时；
4. 比较 batch size 变化对耗时和显存的影响；
5. 使用 `torch.profiler` 观察一次模型 forward；
6. 使用 `torch.cuda.synchronize()` 对比同步前后的计时差异。

### 交付物

```text
reports/p0_torch_cuda_inference.md
```

报告至少包含：

- 实验环境；
- GPU 型号；
- CUDA / driver；
- PyTorch 版本；
- 输入 shape；
- dtype；
- 耗时；
- 显存；
- profiler top CUDA ops；
- 观察结论。

## P1. Operator and Kernel Basics

### 目标

理解 Python、operator、kernel、Triton CUDA、PyTorch custom op 之间的关系。这个项目不要求写高性能 CUDA，而是先建立“会用、会看、会 profile、会写简单 Triton CUDA kernel”的能力。

### 需要实现

```text
operator_labs/tensor_layout.py
operator_labs/profile_forward.py
operator_labs/triton_vector_add.py
operator_labs/triton_fused_add_relu.py
operator_labs/triton_rmsnorm.py
operator_labs/custom_op_notes.md
```

### 必做实验

1. 观察 `shape / stride / contiguous`；
2. 对比 contiguous 与 non-contiguous tensor 的 op 行为；
3. 使用 `torch.profiler` 找到一次 forward 的 top CUDA ops；
4. 写一个 Triton CUDA vector add；
5. 写一个 Triton CUDA fused add + relu；
6. 尝试写 RMSNorm 或阅读 RMSNorm kernel；
7. 阅读 PyTorch custom op 文档，写一页笔记。

### 报告表格

| experiment | input shape | dtype | contiguous | CPU time | CUDA time | observation |
|---|---:|---|---|---:|---:|---|
| tensor layout | | | | | | |
| profiler forward | | | | | | |
| triton vector add | | | | | | |
| triton fused add relu | | | | | | |

### 通过标准

能解释：

- Python 调用 tensor op 和 Python 自己逐元素循环的区别；
- operator 和 kernel 的区别；
- shape、stride、contiguous 为什么影响性能；
- kernel fusion 为什么可能提升性能；
- Triton 为什么看起来像 Python，但不是普通 Python；
- PyTorch custom op 解决什么问题；
- 为什么 vLLM / SGLang 需要 attention backend 和 KV cache metadata。

## P2. CUDA GPU Programming Basics

### 目标

认真理解 CUDA/GPU 编程模型，但不一开始写复杂 CUDA kernel。

### 需要实现

```text
cuda_labs/00_check_cuda.py
cuda_labs/01_vector_add.cu
cuda_labs/02_reduction.cu
cuda_labs/03_simple_softmax.cu
cuda_labs/04_cuda_streams.py
cuda_labs/05_torch_profiler_cuda.py
reports/p2_cuda_gpu_programming.md
```

### 必做实验

1. CUDA 环境检查；
2. CUDA vector add；
3. reduction 最小实验；
4. simple softmax 或阅读 softmax kernel；
5. CUDA stream / async execution 观察；
6. 使用 profiler 看 CUDA ops；
7. 写一页笔记解释 thread / block / grid / warp / SM / memory hierarchy。

### 通过标准

能解释：

- kernel launch 是什么；
- thread、block、grid 的关系；
- warp 和 SM 是什么；
- global memory、shared memory、register 的区别；
- memory coalescing 为什么重要；
- 为什么 GPU benchmark 需要同步；
- 为什么 CUDA C++ 不应该一开始就直接写 FlashAttention。

## P3. Naive Generation

### 目标

不用 `model.generate()`，手写最简单的 autoregressive decoding loop。

### 需要实现

```text
experiments/generate_naive.py
experiments/sampling.py
```

### 必做实验

1. greedy decoding；
2. temperature sampling；
3. top-p sampling；
4. top-k sampling；
5. 不同 prompt length 下的耗时。

### 通过标准

能解释：

- logits 是什么；
- 为什么取最后一个 token 的 logits；
- 为什么每生成一个 token 都要再 forward；
- sampling 参数如何影响输出。

## P4. KV Cache Generation

### 目标

理解 KV cache 如何减少重复计算，以及它为什么消耗大量显存。

### 需要实现

```text
experiments/generate_with_kv_cache.py
experiments/kv_cache_memory.py
```

### 必做实验

1. naive decoding vs KV cache decoding；
2. prompt length 128 / 1024 / 4096；
3. output length 32 / 128 / 512；
4. 记录 TTFT 和 TPOT；
5. 记录显存峰值。

### 报告表格

| prompt tokens | output tokens | cache | TTFT | TPOT | peak memory | notes |
|---:|---:|---|---:|---:|---:|---|
| 128 | 128 | off | | | | |
| 128 | 128 | on | | | | |
| 1024 | 128 | off | | | | |
| 1024 | 128 | on | | | | |

## P5. Toy LLM Server

### 目标

写一个低效但可观测的 LLM HTTP server。它的价值在于暴露真实 serving 痛点。

### 需要实现

```text
toy_server/server.py
toy_server/client.py
toy_server/client_streaming.py
benchmarks/benchmark_toy_server.py
```

### 功能要求

- `/v1/chat/completions`；
- non-streaming；
- streaming；
- 记录 TTFT、TPOT、E2E latency；
- 支持并发压测；
- 输出 benchmark CSV。

### 必做实验

| concurrency | prompt tokens | max output tokens | expected observation |
|---:|---:|---:|---|
| 1 | 128 | 128 | baseline |
| 4 | 128 | 128 | 并发带来的排队 |
| 8 | 1024 | 128 | prefill 压力 |
| 8 | 128 | 512 | decode 压力 |

### 通过标准

能解释：

- 为什么每个请求独立 generate 会低效；
- 为什么 request-level batching 不适合长短不一的生成；
- 为什么 serving 系统需要 scheduler。

## P6. vLLM Lab

### 目标

掌握 vLLM 的基础使用、benchmark 方法和源码主路径，重点理解 CUDA path 下的 attention backend、KV cache metadata 和 profiler 结果。

### 需要实现

```text
vllm_labs/run_server.sh
vllm_labs/client_openai.py
vllm_labs/client_streaming.py
vllm_labs/benchmark_serving.sh
vllm_labs/benchmark_report.md
vllm_labs/source_notes.md
vllm_labs/attention_backend_notes.md
```

### 必做实验

1. offline batched inference；
2. OpenAI-compatible server；
3. streaming；
4. 不同 `max_model_len`；
5. 不同 `gpu_memory_utilization`；
6. 有无 prefix caching；
7. short-short / short-long / long-short / long-long workload；
8. 阅读 attention backend / KV cache metadata 相关代码路径并写笔记。

### 源码笔记必须覆盖

- API server；
- engine；
- scheduler；
- KV cache manager；
- model runner；
- attention backend；
- block table / KV cache layout；
- CUDA graph；
- sampling / logits processing。

## P7. SGLang Lab

### 目标

掌握 SGLang 的 server、offline engine、structured output 和 prefix reuse，重点理解 runtime、radix cache、memory pool 与 CUDA/Triton kernel 的边界。

### 需要实现

```text
sglang_labs/run_server.sh
sglang_labs/client_openai.py
sglang_labs/client_streaming.py
sglang_labs/offline_engine.py
sglang_labs/structured_output.py
sglang_labs/radix_cache_benchmark.py
sglang_labs/source_notes.md
sglang_labs/kernel_runtime_notes.md
```

### 必做实验

1. OpenAI-compatible server；
2. offline engine；
3. streaming；
4. JSON schema / regex / grammar structured output；
5. 共享 prefix 与不共享 prefix 的对比；
6. 与 vLLM 在相同模型、相同 workload 下对比；
7. 阅读 radix cache、memory pool、structured output decoding 与 kernel/runtime 连接处。

### 通过标准

能解释：

- RadixAttention 与 prefix cache 的关系；
- structured output 为什么需要 decoder-level 约束；
- SGLang 更适合哪些复杂 generation workflow；
- radix cache / token pool / KV pool 如何影响底层 attention 和 decode。

## P8. Paper Reproduction Notes

### 目标

每篇关键论文复现一个现象，而不是完整复现系统。

### 推荐任务

| 论文方向 | 最小复现 |
|---|---|
| FlashAttention | prompt length 对 attention 耗时的影响 |
| Orca | 普通 batch vs iteration-level scheduling 的差异 |
| PagedAttention | max context 对 KV cache 显存预算的影响 |
| SGLang | 共享 prefix 对 TTFT 的影响 |
| Sarathi-Serve | long prefill 对 decode 延迟的影响 |
| Speculative Decoding | acceptance rate 与加速比 |
| Kernel fusion | fused vs unfused op 的耗时差异 |
| Quantization | fp16/int8/int4 显存、吞吐、质量的变化 |

### 笔记模板

```text
Paper:
Claim:
Minimal experiment:
Setup:
Result:
Does it match the claim:
Limitation:
```

## P9. First OSS Contribution

### 目标

完成第一个真实开源贡献，可以是 PR，也可以是高质量 issue reproduction。

### 候选任务

- 修正文档命令；
- 补充一个小 example；
- 复现一个 issue；
- 写一个 regression test；
- 复现一个 benchmark；
- 提交一个小 bugfix；
- 补充 CUDA / operator / kernel / attention backend 相关说明；
- 补充一个 profiling 或 benchmark 示例。

### 验收标准

至少完成以下之一：

1. 一个 merged PR；
2. 一个被维护者确认有效的 issue reproduction；
3. 一个被项目采用或讨论的 benchmark report；
4. 一个能帮助定位 bug 的最小测试用例；
5. 一个能帮助解释 attention backend / CUDA kernel / profiling 行为的文档或 example。

## 实验记录规范

所有实验都应该记录：

```text
Date:
Commit:
Model:
GPU:
CUDA:
Driver:
Command:
Workload:
Metrics:
Profiler result:
Observation:
Next step:
```

## 建议目录

```text
experiments/
operator_labs/
cuda_labs/
toy_server/
benchmarks/
vllm_labs/
sglang_labs/
reports/
notes/
```
