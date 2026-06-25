# 论文路线

本文档给出 LLM 推理基础设施方向的论文阅读路线。目标不是“读最多论文”，而是建立一个能指导工程实践和开源贡献的知识框架。

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

## Level 0：Transformer 与生成基础

这些论文帮助你理解模型为什么这样推理。只需要读懂主线，不需要从数学细节开始。

| 优先级 | 论文 | 重点问题 |
|---|---|---|
| Must | Attention Is All You Need | Transformer block、self-attention、seq2seq 基础 |
| Must | Language Models are Few-Shot Learners | autoregressive LM、prompting、scale 对推理系统的压力 |
| Should | RoFormer / RoPE 相关论文 | 位置编码与长上下文实现关系 |
| Should | Multi-Query Attention | 为什么减少 KV head 可以降低 KV cache 压力 |
| Optional | Grouped-Query Attention | GQA 如何在质量和 KV cache 成本之间折中 |

阅读目标：

- 能解释 attention 的输入输出 shape；
- 能解释自回归生成为什么每次产生一个 token；
- 能解释 KV cache 中 K/V 张量大致由哪些维度决定。

## Level 1：PyTorch / GPU / Kernel 直觉

这部分不是只读论文，更重要的是配合实验。

| 优先级 | 论文 / 资料 | 重点问题 |
|---|---|---|
| Must | FlashAttention | 为什么 attention 是 IO-bound，为什么减少 HBM 读写很关键 |
| Should | FlashAttention-2 | work partitioning、并行度、GPU 利用率 |
| Optional | FlashAttention-3 | Hopper 架构、异步能力、低精度计算趋势 |
| Should | Triton tutorials | block-level 编程、matmul、softmax、kernel fusion |

阅读目标：

- 能区分 compute-bound 和 memory-bound；
- 能解释为什么同样的数学计算，不同 kernel 性能差距巨大；
- 能理解 serving 框架为什么依赖 FlashAttention / FlashInfer / Triton / CUDA kernel。

## Level 2：LLM Serving 经典论文

这是学习 vLLM / SGLang 前最重要的一组。

| 优先级 | 论文 | 重点问题 |
|---|---|---|
| Must | Orca: A Distributed Serving System for Transformer-Based Generative Models | iteration-level scheduling、continuous batching 的雏形 |
| Must | Efficient Memory Management for Large Language Model Serving with PagedAttention | KV cache 分页、block 管理、vLLM 核心思想 |
| Must | SGLang: Efficient Execution of Structured Language Model Programs | structured LM program、RadixAttention、compressed FSM |
| Should | FasterTransformer / TensorRT-LLM 相关资料 | 高性能推理后端、kernel、并行策略 |
| Should | Hugging Face TGI 相关资料 | production serving、routing、streaming、deployment |

阅读目标：

- 能解释 continuous batching 为什么比 request-level batching 更适合生成；
- 能解释 PagedAttention 解决的不是 attention 数学问题，而是 KV cache memory management 问题；
- 能解释 SGLang 为什么把“程序结构”和“runtime cache reuse”结合起来。

## Level 3：Scheduling、Prefill/Decode 与 Disaggregation

这部分面向更前沿的 serving 系统设计。

| 优先级 | 论文 | 重点问题 |
|---|---|---|
| Must | Sarathi-Serve | chunked prefill，prefill 与 decode 如何协同 |
| Must | DistServe | disaggregated prefill/decode，goodput 优化 |
| Should | Splitwise | prefill/decode 分离和不同硬件资源配置 |
| Should | Mooncake | KV cache-centric disaggregated serving |
| Optional | 其他 PD disaggregation / KV routing 论文 | 多节点、多副本、跨机器 KV 管理 |

阅读目标：

- 能解释 prefill 和 decode 的计算特征为什么不同；
- 能解释为什么长 prompt 会拖慢 decode；
- 能解释 disaggregation 的收益、代价和适用场景。

## Level 4：KV Cache、Prefix Cache 与上下文复用

这部分直接对应 vLLM/SGLang 中的 cache 相关功能。

| 优先级 | 论文 / 系统 | 重点问题 |
|---|---|---|
| Must | PagedAttention | paged KV cache、fragmentation、copy-on-write |
| Must | RadixAttention | 多请求、多轮、多分支生成中的 prefix reuse |
| Should | LMCache 相关资料 | KV cache 在系统层面的复用、offload、sharing |
| Should | CacheBlend / CacheGen 等方向 | 长上下文、RAG、多文档场景下的 cache 管理 |
| Optional | Semantic cache / prompt cache 论文 | 文本语义复用与 KV 精确复用的差异 |

阅读目标：

- 能区分 prompt cache、prefix cache、KV cache、semantic cache；
- 能解释 prefix 复用为什么需要匹配 token 序列，而不是只匹配字符串；
- 能解释 KV offload 为什么可能降低显存压力但增加延迟。

## Level 5：Speculative Decoding 与多 token 预测

这部分用于理解 vLLM/SGLang 中的加速功能。

| 优先级 | 论文 | 重点问题 |
|---|---|---|
| Must | Fast Inference from Transformers via Speculative Decoding | draft model、verify、acceptance rate |
| Must | SpecInfer | 多候选 tree verification |
| Should | Medusa | 多 decoding heads，减少额外 draft model 需求 |
| Should | EAGLE | feature-level autoregression，speculative sampling |
| Optional | Lookahead decoding / prompt lookup decoding | 不同 speculative 策略的适用场景 |

阅读目标：

- 能解释 speculative decoding 为什么不改变目标分布；
- 能解释 acceptance rate 与速度收益之间的关系；
- 能解释为什么小模型不一定总能加速大模型。

## Level 6：Quantization、低精度与显存优化

这部分对部署大模型很重要，但可以在 vLLM/SGLang 主路径跑通后再深入。

| 优先级 | 论文 / 方法 | 重点问题 |
|---|---|---|
| Must | SmoothQuant | activation 与 weight quantization 的平衡 |
| Must | GPTQ | post-training quantization、weight-only quantization |
| Should | AWQ | activation-aware weight quantization |
| Should | FP8 inference 相关资料 | FP8 对吞吐和显存的影响 |
| Optional | KV cache quantization | KV cache 量化对长上下文 serving 的意义 |

阅读目标：

- 能区分 weight-only quantization、activation quantization、KV cache quantization；
- 能解释量化为什么不只是“模型变小”，还会影响 kernel 和吞吐；
- 能解释不同硬件对 fp8/int8/int4 支持差异。

## Level 7：Structured Output 与 Constrained Decoding

这部分与 SGLang 关系更强，也与真实应用中的 JSON 输出、函数调用、工具调用密切相关。

| 优先级 | 论文 / 系统 | 重点问题 |
|---|---|---|
| Must | SGLang | compressed FSM、structured decoding |
| Should | Guidance / Outlines / LMQL 等系统 | 约束生成、grammar、schema |
| Should | Jsonformer / constrained decoding 相关资料 | JSON schema 为什么需要 decoder 级约束 |
| Optional | tool calling / function calling 相关资料 | 应用层协议和推理层约束的关系 |

阅读目标：

- 能解释为什么 prompt 要求“输出 JSON”不等于可靠 JSON；
- 能解释 constrained decoding 如何修改 token 选择空间；
- 能解释 grammar/schema 越复杂，decode 可能越慢。

## 论文阅读顺序建议

### 第一轮：建立 serving 主线

```text
Attention Is All You Need
→ FlashAttention
→ Orca
→ PagedAttention / vLLM
→ SGLang
```

### 第二轮：理解系统优化

```text
Sarathi-Serve
→ DistServe
→ Splitwise
→ Mooncake
→ LMCache / CacheBlend 方向
```

### 第三轮：理解推理加速

```text
Speculative Decoding
→ SpecInfer
→ Medusa
→ EAGLE
→ quantization papers
```

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
