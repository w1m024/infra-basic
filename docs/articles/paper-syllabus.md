# 论文与文档伴读路线

本文档按学习阶段组织论文阅读。论文不作为独立阶段，而是在各阶段按问题补充阅读——先用工程实验建立直觉，再读论文回答具体问题。

## 阅读方法

每篇论文至少回答 6 个问题：

1. 它解决的 serving 问题是什么？
2. 它优化的是 latency、throughput、memory、cost、quality，还是可编程性？
3. 它的核心系统设计是什么？
4. 它和已有系统相比新在哪里？
5. 它的 evaluation workload 是否接近真实 serving？
6. 它的方案能否在 vLLM / SGLang 中找到类似实现或对照点？

建议做笔记时使用固定模板：

```text
Paper:
Problem:
Key idea:
System design:
Important figures/tables:
Assumptions:
Limitations:
Relation to vLLM/SGLang:
Possible reproduction:
```

## 阶段 2 补充：Transformer 与生成基础

这些论文帮助你理解模型为什么这样推理。只需要读懂主线，不需要从数学细节开始。

| 优先级 | 论文 | 重点问题 |
|---|---|---|
| Must | Attention Is All You Need | Transformer block、self-attention、seq2seq 基础 |
| Must | Language Models are Few-Shot Learners | autoregressive LM、prompting、scale 对推理系统的压力 |
| Should | Multi-Query Attention | 为什么减少 KV head 可以降低 KV cache 压力 |
| Should | Grouped-Query Attention | GQA 如何在质量和 KV cache 成本之间折中 |
| Optional | RoFormer / RoPE 相关论文 | 位置编码与长上下文实现关系 |

阅读目标：

- 能解释 attention 的输入输出 shape；
- 能解释自回归生成为什么每次产生一个 token；
- 能解释 KV cache 中 K/V 张量大致由哪些维度决定。

## 阶段 3 补充：LLM Serving 经典论文

这是学习 vLLM / SGLang 前最重要的一组。

| 优先级 | 论文 | 重点问题 |
|---|---|---|
| Must | Orca: A Distributed Serving System for Transformer-Based Generative Models | iteration-level scheduling、continuous batching 的雏形 |
| Must | PagedAttention | KV cache 分页、block 管理、vLLM 核心思想 |
| Should | Hugging Face TGI 相关资料 | production serving、routing、streaming、deployment |

阅读目标：

- 能解释 continuous batching 为什么比 request-level batching 更适合生成；
- 能解释 PagedAttention 解决的不是 attention 数学问题，而是 KV cache memory management 问题。

## 阶段 4 补充：Kernel 与 Triton

配合 Operator/Kernel 入门实验。

| 优先级 | 论文 / 资料 | 重点问题 |
|---|---|---|
| Should | Triton tutorials | block-level 编程、matmul、softmax、kernel fusion |

阅读目标：

- 能区分 compute-bound 和 memory-bound；
- 能解释为什么同样的数学计算，不同 kernel 性能差距巨大。

## 阶段 5 补充：CUDA Programming Model

配合 CUDA/GPU 编程入门实验。

| 优先级 | 论文 / 资料 | 重点问题 |
|---|---|---|
| Must | FlashAttention | 为什么 attention 是 IO-bound，为什么减少 HBM 读写很关键 |
| Should | FlashAttention-2 | work partitioning、并行度、GPU 利用率 |
| Optional | FlashAttention-3 | Hopper 架构、异步能力、低精度计算趋势 |

阅读目标：

- 能解释为什么 serving 框架依赖 FlashAttention / FlashInfer / Triton / CUDA kernel。

## 阶段 6 补充：vLLM 深入

| 优先级 | 论文 | 重点问题 |
|---|---|---|
| Must | PagedAttention | paged KV cache、fragmentation、copy-on-write |
| Should | FasterTransformer / TensorRT-LLM 相关资料 | 高性能推理后端、kernel、并行策略 |

阅读目标：

- 能解释 PagedAttention 解决的具体工程问题。

## 阶段 7 补充：SGLang 深入

| 优先级 | 论文 / 系统 | 重点问题 |
|---|---|---|
| Must | SGLang: Efficient Execution of Structured Language Model Programs | structured LM program、RadixAttention、compressed FSM |
| Must | RadixAttention | 多请求、多轮、多分支生成中的 prefix reuse |
| Should | Guidance / Outlines / LMQL 等系统 | 约束生成、grammar、schema |
| Optional | Speculative Decoding / SpecInfer / Medusa / EAGLE | speculative decoding 加速原理 |

阅读目标：

- 能解释 SGLang 为什么把"程序结构"和"runtime cache reuse"结合起来；
- 能解释 RadixAttention 与普通 prefix cache 的关系；
- 能解释 structured output 为什么不能只靠 prompt 约束。

## 深入方向（阶段 6-7 之后）

完成主线后，根据兴趣选择深入：

| 方向 | 论文 | 重点问题 |
|---|---|---|
| KV Cache 管理 | LMCache / CacheBlend / CacheGen | KV cache 在系统层面的复用、offload、sharing |
| Disaggregation | Sarathi-Serve / DistServe / Splitwise / Mooncake | prefill/decode 分离、goodput 优化 |
| Quantization | SmoothQuant / GPTQ / AWQ / FP8 | 低精度推理对吞吐和显存的影响 |

## 不建议的阅读方式

不要这样读：

```text
从最新论文开始
→ 直接看复杂系统图
→ 不知道 prefill/decode/KV cache 的工程含义
→ 读完没有实验对应
```

建议这样读：

```text
先做 toy experiment
→ 带着瓶颈读论文
→ 找到 vLLM/SGLang 中的实现位置
→ 做一个小 benchmark 复现论文中的核心现象
```

## 每篇论文的工程复现粒度

不要试图完整复现论文系统。对初学者，更合理的是复现一个关键现象：

| 论文方向 | 可复现实验 |
|---|---|
| FlashAttention | prompt length 变长时 attention 耗时变化 |
| Orca | request-level batching vs iteration-level batching 的差异 |
| PagedAttention | 不同 max context 下 KV cache 显存占用变化 |
| SGLang | 有共享 prefix 与无共享 prefix 的吞吐差异 |
| Sarathi-Serve | 长 prefill 对 decode 延迟的影响 |
| Speculative Decoding | draft model acceptance rate 与加速比 |
| Quantization | fp16/int8/int4 显存、吞吐、质量的变化 |
