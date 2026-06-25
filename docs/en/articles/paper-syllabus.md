# Paper Syllabus

This document provides a paper reading roadmap for LLM inference infrastructure. The goal is not to "read the most papers", but to build a knowledge framework that guides engineering practice and open source contribution.

## Reading Method

Each paper should answer at least 6 questions:

1. What serving problem does it solve?
2. Does it optimize latency, throughput, memory, cost, quality, or programmability?
3. What is its core system design?
4. What is new compared to existing systems?
5. Is its evaluation workload close to real serving?
6. Can its approach be found as similar implementation or reference in vLLM / SGLang?

## Level 0: Transformer & Generation Basics

These papers help you understand why models reason this way. Only read the main line - no need to start from mathematical details.

| Priority | Paper | Key Questions |
|---|---|---|
| Must | Attention Is All You Need | Transformer block, self-attention, seq2seq basics |
| Must | Language Models are Few-Shot Learners | Autoregressive LM, prompting, scale pressure on inference systems |
| Should | RoFormer / RoPE papers | Position encoding and long context implementation |
| Should | Multi-Query Attention | Why reducing KV heads reduces KV cache pressure |
| Optional | Grouped-Query Attention | How GQA trades off quality and KV cache cost |

## Level 1: PyTorch / GPU / Kernel Intuition

This section is not just about papers - it's more important to combine with experiments.
