# DeepSeek 基础设施全景

DeepSeek 相关开源项目值得单独成章，因为它们不是一个单一 serving framework，而是一组围绕 DeepSeek-V3 / R1 / V3.2 这类大规模 MoE 模型形成的底层基础设施：attention kernel、FP8 GEMM、expert-parallel communication、filesystem 和模型架构协同。

## 重点项目

| 项目 | 官方入口 | 学习重点 |
|---|---|---|
| DeepSeek-V3 / R1 / V3.2 | https://github.com/deepseek-ai | MoE、MLA、FP8、reasoning model、long context serving |
| FlashMLA | https://github.com/deepseek-ai/FlashMLA | Multi-head Latent Attention kernels、prefill / decode、FP8 KV cache、sparse attention |
| DeepGEMM | https://github.com/deepseek-ai/DeepGEMM | FP8 / FP4 / BF16 GEMM、MoE GEMM、JIT CUDA kernel、tensor core |
| DeepEP | https://github.com/deepseek-ai/DeepEP | Expert Parallel communication、all-to-all、MoE dispatch / combine、NVLink / RDMA |
| 3FS | https://github.com/deepseek-ai/3FS | AI training / inference workload 下的高性能分布式文件系统 |

## 为什么值得学

DeepSeek stack 的价值在于模型设计和系统实现强耦合：

```text
MoE model architecture
→ expert routing
→ all-to-all communication
→ DeepEP dispatch / combine
→ FP8 GEMM / MoE GEMM
→ DeepGEMM
→ MLA / sparse attention
→ FlashMLA
→ large-scale training / inference storage
→ 3FS
```

它适合回答：一个前沿模型为什么不能只靠通用 PyTorch op 和普通 serving engine 跑到极致性能。

## 源码阅读目标

1. FlashMLA 如何把 MLA attention 映射到底层 kernel；
2. FP8 KV cache 对 memory bandwidth 和 decode 有什么影响；
3. DeepGEMM 如何组织 JIT kernel、scaling、dense / MoE GEMM；
4. DeepEP 如何做 MoE dispatch / combine 和 all-to-all；
5. DeepEP 输出如何与 DeepGEMM 的 MoE GEMM 输入衔接；
6. 3FS 解决的是训练 / 推理数据路径中的什么瓶颈；
7. DeepSeek 模型结构如何反向塑造 kernel 和 communication library。

## 建议实验

| 实验 | 目标 |
|---|---|
| 阅读 FlashMLA README 和 kernel 入口 | 理解 MLA 与普通 MHA / GQA 的差异 |
| 跑 DeepGEMM examples | 观察 FP8 GEMM、scaling、JIT 编译和 shape 限制 |
| 阅读 DeepEP dispatch/combine API | 理解 expert parallel 的数据重排 |
| 对照 vLLM DeepSeek recipe | 理解 serving engine 如何接入 DeepSeek 模型 |
| 画 MoE token flow | 从 router 到 expert GEMM 再到 combine |

## 通过标准

能解释：

1. MLA 为什么需要专门 attention kernel；
2. FP8 GEMM 为什么对 DeepSeek-V3/R1 这类模型重要；
3. MoE serving 为什么瓶颈不只是 GEMM，还有 all-to-all；
4. DeepEP 和 DeepGEMM 分别处在 MoE 推理路径的什么位置；
5. 为什么 DeepSeek stack 是学习 LLM infra 的重要案例，而不只是“一个模型仓库”。
