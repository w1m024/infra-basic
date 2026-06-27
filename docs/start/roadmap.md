# 学习路线

本路线面向想从零进入 **LLM 推理基础设施** 的学习者。重点不是训练大模型，而是理解模型如何被高效服务化，并逐步具备参与 vLLM / SGLang 开源贡献的能力。

本仓库默认采用 **CUDA-first / NVIDIA 标准环境**：

```text
Linux
→ NVIDIA GPU
→ NVIDIA Driver
→ CUDA Toolkit
→ PyTorch CUDA
→ Triton CUDA
→ vLLM / SGLang CUDA path
```

非 CUDA 后端、AMD/ROCm、国产硬件、Paddle custom device 等内容只作为扩展阅读或对照材料，不作为主线学习环境。

## 前置假设

不覆盖：

- Linux 基础命令；
- Python 基础语法；
- Git 基础操作；
- 深度学习完整训练理论。

默认已经具备：

- 能写普通 Python 脚本；
- 能安装包、创建虚拟环境、运行命令行；
- 能 clone repo、开 branch、提交 commit；
- 能读英文文档和论文摘要。

## 学习主线

```text
PyTorch CUDA 推理基础
→ Operator / Kernel 基础
→ CUDA/GPU 编程模型
→ Transformers 生成过程
→ KV Cache / prefill / decode
→ toy serving + benchmark
→ vLLM 主路径
→ SGLang 主路径
→ 论文体系
→ issue reproduction / test / benchmark / small PR
```

## 阶段 1：PyTorch CUDA 推理基础

目标：不是学训练，而是学推理时会遇到的 tensor、dtype、device、memory、profiling。

### 必会概念

- Tensor shape
- dtype: fp32, fp16, bf16, int8, fp8
- CPU / GPU device movement
- `torch.no_grad()` 与 `torch.inference_mode()`
- batch dimension
- CUDA OOM
- `torch.cuda.memory_allocated()` / `torch.cuda.max_memory_allocated()`
- `torch.cuda.synchronize()`
- `torch.profiler`
- `nvidia-smi`

### 交付物

- `experiments/torch_memory.py`
- `experiments/matmul_benchmark.py`
- `experiments/profiler_demo.py`
- 一张表：不同 dtype、不同 shape、CPU/GPU 的耗时和显存

### 通过标准

能解释：

1. 为什么 batch 变大通常吞吐变高但延迟和显存也会上升；
2. 为什么 bf16/fp16 能降低显存；
3. 为什么 GPU 利用率不是“模型跑在 GPU 上”就自然很高；
4. 为什么 CUDA 操作经常是异步的，benchmark 为什么需要同步。

## 阶段 2：Operator / Kernel 基础

目标：理解 Python、operator、kernel、Triton、CUDA、custom op 之间的关系。这个阶段不要求写高性能 CUDA，只要求先会看算子、profile 算子，并能写简单 Triton CUDA kernel。

详见：[Operator / Kernel 入门](/reference/operator-kernel-guide)。

### 必会概念

- operator vs kernel
- framework dispatcher
- tensor shape / stride / contiguous
- kernel launch
- fusion
- Triton JIT kernel
- CUDA C++ kernel
- PyTorch custom op
- vLLM / SGLang attention backend

### 交付物

- `operator_labs/tensor_layout.py`
- `operator_labs/profile_forward.py`
- `operator_labs/triton_vector_add.py`
- `operator_labs/triton_rmsnorm.py`
- `reports/operator_kernel_basics.md`

### 通过标准

能解释：

1. Python 调 `torch.matmul` 为什么不是 Python 自己逐元素计算；
2. operator 和 kernel 的区别是什么；
3. shape、stride、contiguous 为什么影响性能；
4. fusion 为什么可能减少 kernel launch 和 HBM 读写；
5. Triton 和普通 Python 有什么区别；
6. 为什么不要一开始直接写 FlashAttention 或复杂 CUDA kernel。

## 阶段 3：CUDA/GPU 编程模型

目标：认真理解 CUDA 思维，但不一开始深挖复杂 CUDA C++。这是理解 vLLM / SGLang attention backend、FlashAttention、FlashInfer、CUTLASS 和 kernel profiling 的基础。

详见：[CUDA GPU 入门](/reference/cuda-gpu-guide)。

### 必会概念

- kernel launch
- thread / block / grid
- warp
- SM: Streaming Multiprocessor
- global memory / HBM
- shared memory
- register
- memory coalescing
- occupancy
- synchronization
- CUDA stream
- CUDA graph
- Nsight Systems / Nsight Compute

### 交付物

- `cuda_labs/00_check_cuda.py`
- `cuda_labs/01_vector_add.cu`
- `cuda_labs/02_reduction.cu`
- `cuda_labs/03_simple_softmax.cu`
- `cuda_labs/04_cuda_streams.py`
- `cuda_labs/05_torch_profiler_cuda.py`
- `reports/cuda_gpu_programming_basics.md`

### 通过标准

能解释：

1. thread、block、grid 的关系；
2. warp 和 SM 是什么；
3. global memory、shared memory、register 的差异；
4. memory coalescing 为什么重要；
5. kernel launch overhead 为什么影响小 op；
6. 为什么 benchmark GPU 代码需要同步；
7. Triton 和 CUDA C++ 分别适合什么阶段。

## 阶段 4：Transformers 生成过程

目标：理解一个请求如何从文本变成 token，再一步步生成输出。

### 必会概念

- tokenizer
- token ids
- logits
- greedy / temperature / top-p / top-k
- autoregressive decoding
- `model.generate()`
- 手写 decoding loop
- KV Cache / `past_key_values`
- prefill phase
- decode phase

### 建议模型

优先使用小模型，避免环境问题掩盖学习目标。

- `Qwen/Qwen2.5-0.5B-Instruct`
- `Qwen/Qwen2.5-1.5B-Instruct`
- `TinyLlama/TinyLlama-1.1B-Chat-v1.0`

### 交付物

- `experiments/generate_naive.py`
- `experiments/generate_with_kv_cache.py`
- `experiments/sampling.py`
- 一张表：naive decoding 与 KV cache decoding 的耗时对比

### 通过标准

能解释：

1. prompt 越长，prefill 为什么越慢；
2. decode 为什么通常一个 token 一个 step；
3. KV cache 为什么能避免重复计算；
4. KV cache 为什么又会成为显存瓶颈。

## 阶段 5：Toy LLM Serving

目标：自己写一个很慢的 LLM server，理解 vLLM/SGLang 解决的痛点。

### 需要实现

- `/v1/chat/completions`
- 非流式返回
- 流式返回
- 简单 request queue
- 简单 batch 或不做 batch，然后观察低效
- benchmark script

### 必测指标

- TTFT: Time To First Token
- TPOT / ITL: Time Per Output Token / Inter-Token Latency
- E2E latency
- requests/s
- output tokens/s
- GPU memory usage
- GPU utilization

### 交付物

- `toy_server/server.py`
- `toy_server/client.py`
- `benchmarks/benchmark_toy_server.py`
- 一份 benchmark 记录：并发 1/2/4/8，prompt 长度 128/1024/4096

### 通过标准

能解释：

1. 为什么每个请求独立 `generate()` 会浪费 GPU；
2. 为什么不同长度请求难以简单 batch；
3. 为什么流式输出会影响 server 设计；
4. 为什么 serving 系统必须处理调度，而不只是包一层 HTTP。

## 阶段 6：vLLM 主路径

目标：把 vLLM 当成一个推理系统学习，而不是只当部署工具使用。

### 需要跑通

- offline batched inference
- OpenAI-compatible server
- streaming request
- benchmark serving
- prefix caching 相关实验
- 不同 `max_model_len`、`gpu_memory_utilization` 的显存变化

### 需要理解

- API server
- engine
- scheduler
- sequence group / request state
- prefill / decode scheduling
- paged KV cache
- block manager / KV cache manager
- model runner
- attention backend
- CUDA graph
- tensor parallel / NCCL 的最小概念

### 交付物

- `vllm_labs/run_server.sh`
- `vllm_labs/client_openai.py`
- `vllm_labs/benchmark.md`
- `vllm_labs/source_notes.md`
- `vllm_labs/attention_backend_notes.md`

### 通过标准

能画出一个请求在 vLLM 中的大致路径：

```text
HTTP request
→ OpenAI API server
→ engine
→ scheduler
→ KV cache allocation
→ model runner
→ attention backend
→ CUDA / Triton kernel
→ streamed tokens
```

并能补充说明：scheduler / model runner 为什么需要为 attention backend 准备 KV cache metadata、block table、positions、token ids 等信息。

## 阶段 7：SGLang 主路径

目标：理解 SGLang 与 vLLM 的共同点和差异，尤其是复杂生成程序、prefix reuse 和 structured output。

### 需要跑通

- OpenAI-compatible server
- native generate API
- offline engine
- streaming / async generation
- JSON / structured output
- prefix cache / RadixAttention 相关实验

### 需要理解

- runtime
- scheduler
- token pool / KV pool
- radix cache
- constrained decoding
- structured output decoding
- speculative decoding 基础
- 多轮对话和 RAG 场景下的前缀复用
- runtime / attention backend / CUDA kernel 的边界

### 交付物

- `sglang_labs/run_server.sh`
- `sglang_labs/client_openai.py`
- `sglang_labs/offline_engine.py`
- `sglang_labs/structured_output.py`
- `sglang_labs/source_notes.md`
- `sglang_labs/kernel_runtime_notes.md`

### 通过标准

能解释：

1. SGLang 为什么强调 structured language model programs；
2. RadixAttention 与普通 prefix cache 的关系；
3. structured output 为什么不能只靠 prompt 约束；
4. vLLM 与 SGLang 在 serving 目标上的差异；
5. radix cache、memory pool、structured output decoding 与底层 CUDA / Triton kernel、logits processing 的关系。

## 阶段 8：论文体系

不要一开始把论文当教科书从头硬读。建议先用工程实验建立直觉，再读论文回答具体问题。

推荐阅读顺序见：[论文路线](/articles/paper-syllabus) 和 [参考文献](/reference/bibliography)。

## 阶段 9：开源贡献

推荐贡献路径：

```text
文档修复
→ example 修复
→ issue reproduction
→ benchmark reproduction
→ test case
→ 小功能
→ scheduler / KV cache / backend 相关改动
```

不要一开始挑战核心调度器或复杂 CUDA/Triton kernel。先通过小 PR 熟悉项目流程、CI、review 风格和代码结构。

详见：[开源贡献手册](/reference/open-source-playbook)。

## 建议周期

| 周期 | 主题 | 产出 |
|---|---|---|
| Week 1-2 | PyTorch CUDA 推理基础 | tensor / memory / profiler 实验 |
| Week 3 | Operator / Kernel 基础 | tensor layout / profiler / Triton 小 kernel |
| Week 4 | CUDA/GPU 编程模型 | vector add / reduction / streams / profiler |
| Week 5-6 | Transformers 生成 | naive decoding / KV cache decoding |
| Week 7-8 | Toy serving | HTTP server / streaming / benchmark |
| Week 9-11 | vLLM | server / benchmark / source notes / backend notes |
| Week 12-14 | SGLang | structured output / radix cache / source notes |
| Week 15-16 | 论文集中阅读 | paper notes |
| Week 17-18 | 开源贡献准备 | issue reproduction / test / first PR |

## 最终验收

完成路线后，应该能独立完成下面任务：

1. 给定一个小模型，分别用 Transformers、vLLM、SGLang 启动推理；
2. 对同一 workload 做 benchmark，并解释差异；
3. 读懂一篇 LLM serving 论文的 problem、method、system design、evaluation；
4. 在 vLLM 或 SGLang 中定位请求处理主路径；
5. 解释 Python、operator、kernel、attention backend、KV cache layout、CUDA graph 的关系；
6. 读懂简单 CUDA kernel，并能解释 thread/block/grid、memory hierarchy 和同步；
7. 复现一个 issue，并提交最小复现脚本；
8. 提交一个小型文档、测试或 benchmark PR。
