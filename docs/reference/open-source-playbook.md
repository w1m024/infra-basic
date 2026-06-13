# 05. Open Source Playbook

本文档给出从学习者到 vLLM / SGLang 开源参与者的路径。目标是降低第一次贡献的门槛，同时避免一开始选择过大的任务。

## 贡献原则

```text
先复现 → 再定位 → 再最小修改 → 再提交 PR
```

不要把第一次贡献目标设成“优化 scheduler”或“写 kernel”。更合理的路径是：

```text
文档
→ example
→ issue reproduction
→ regression test
→ benchmark reproduction
→ small bugfix
→ small feature
→ core system change
```

## 贡献前必须具备的能力

### 工程能力

- 能创建独立虚拟环境；
- 能从源码安装项目；
- 能运行单元测试或指定测试；
- 能读 traceback；
- 能写最小复现脚本；
- 能记录完整环境信息；
- 能用 Git branch 组织修改。

### LLM serving 能力

- 知道 prefill / decode；
- 知道 KV cache；
- 知道 continuous batching；
- 知道 streaming；
- 知道 benchmark 指标；
- 知道 OpenAI-compatible API；
- 知道 workload 分布会影响 benchmark。

## 第一类贡献：文档 PR

这是最适合新手的入口。

### 可以修什么

- quickstart 命令失效；
- 参数名变化；
- 示例模型不可用；
- 示例代码缺少依赖；
- 文档没有说明硬件要求；
- 文档没有说明常见报错；
- benchmark 步骤不完整；
- OpenAI-compatible API 示例缺失。

### 文档 PR 模板

```markdown
## What changed

- Updated ...
- Added ...

## Why

The previous instruction fails on ... / is unclear because ...

## Validation

I tested the command with:

- OS:
- Python:
- GPU:
- CUDA:
- Package version:
- Model:

Command:

```bash
...
```

Result:

```text
...
```
```

## 第二类贡献：Example PR

example 的价值在于“最小、可运行、可复现”。

### 好 example 的标准

- 代码短；
- 依赖少；
- 模型小；
- 命令完整；
- 输入输出明确；
- 有注释但不啰嗦；
- 失败时容易定位；
- 不需要特殊硬件才能看懂。

### 适合的 example

#### vLLM

- OpenAI client 最小示例；
- streaming chat completion；
- offline batched inference；
- prefix caching demo；
- benchmark serving 最小命令；
- 量化模型启动示例。

#### SGLang

- OpenAI-compatible client；
- native generation；
- offline engine；
- structured output JSON schema；
- regex / grammar constrained decoding；
- radix cache / prefix reuse demo。

## 第三类贡献：Issue Reproduction

很多开源项目真正需要的是“把模糊问题变成可复现问题”。

### 选择 issue 的标准

优先选择：

- 最近有人维护者回复；
- 报错清晰；
- 模型不太大；
- 不需要多机环境；
- 不依赖特殊硬件；
- 你能在一天内构造最小复现。

避免选择：

- 只在 8 卡/多机出现；
- 涉及私有模型或私有数据；
- 涉及复杂生产环境；
- 描述不清且作者没有回复；
- 需要改 kernel 或底层通信库。

### Reproduction checklist

```text
1. 固定项目版本 / commit
2. 固定模型
3. 固定启动命令
4. 固定请求 payload
5. 用最小输入复现
6. 记录完整日志
7. 判断是否与环境相关
8. 写一个独立脚本
9. 回复 issue 或开 PR
```

### 最小复现脚本结构

```python
"""Minimal reproduction for issue #xxxx."""

import os
import time
from openai import OpenAI

BASE_URL = os.environ.get("BASE_URL", "http://localhost:8000/v1")
MODEL = os.environ.get("MODEL", "...")

client = OpenAI(base_url=BASE_URL, api_key="EMPTY")

start = time.perf_counter()
resp = client.chat.completions.create(
    model=MODEL,
    messages=[{"role": "user", "content": "..."}],
    max_tokens=128,
    temperature=0,
)
print(resp.choices[0].message.content)
print("elapsed", time.perf_counter() - start)
```

## 第四类贡献：Regression Test

当你能复现 bug 后，下一步是加测试。

### 好测试的标准

- 测一个明确行为；
- 不依赖大模型；
- 不依赖外部网络；
- 不需要昂贵硬件；
- 能在 CI 或本地快速运行；
- 失败信息清楚。

### 测试方向

#### vLLM

- request parsing；
- sampling 参数；
- OpenAI-compatible response format；
- streaming chunk format；
- prefix cache edge case；
- scheduler 边界条件；
- quantization 配置解析。

#### SGLang

- structured output schema；
- regex / grammar；
- OpenAI-compatible response format；
- radix cache edge case；
- streaming response；
- server 参数解析。

## 第五类贡献：Benchmark Reproduction

Benchmark 贡献很有价值，但必须严谨。

### Benchmark 报告必须写清楚

- 模型；
- GPU；
- driver / CUDA；
- framework version / commit；
- 启动命令；
- workload；
- prompt token 分布；
- output token 分布；
- concurrency；
- 是否 streaming；
- 是否 prefix cache；
- 是否量化；
- 是否 speculative decoding；
- 指标定义。

### Benchmark 不要犯的错误

- 只给最终 tokens/s，不给 workload；
- 不写 prompt/output 长度；
- 不写并发；
- 用不同模型对比框架；
- 用不同 dtype 对比框架；
- 把 client 端瓶颈算进服务端；
- 只跑一次就下结论；
- 不记录 warmup。

## PR 工作流

### 1. 准备 branch

```bash
git checkout -b fix/minimal-repro-xxx
```

### 2. 做最小修改

一次 PR 只解决一个问题。不要顺手重构无关代码。

### 3. 本地验证

至少运行：

```bash
python your_example.py
# 或
pytest path/to/test.py -q
```

### 4. 写 PR 描述

```markdown
## Summary

...

## Motivation

...

## Changes

- ...
- ...

## Validation

Command:

```bash
...
```

Result:

```text
...
```

## Related issue

Fixes #...
```

### 5. 接受 review

维护者要求改动时，优先：

1. 确认你理解要求；
2. 只改相关内容；
3. 补充验证结果；
4. 不和 reviewer 争论风格问题；
5. 如果不同意，给出实验或文档依据。

## 如何选择第一个 PR

推荐优先级：

| 优先级 | 类型 | 原因 |
|---|---|---|
| 1 | 文档修复 | 成本低，能熟悉流程 |
| 2 | example 修复 | 需要实际跑通，价值更高 |
| 3 | issue 最小复现 | 能建立维护者信任 |
| 4 | regression test | 进入项目质量体系 |
| 5 | benchmark 复现 | 需要严谨实验能力 |
| 6 | 小 bugfix | 开始接触代码逻辑 |
| 7 | 小功能 | 需要理解维护者设计方向 |

## vLLM 贡献切入点

适合初学者：

- docs；
- examples；
- OpenAI-compatible API 行为验证；
- benchmark 脚本说明；
- small model support notes；
- sampling 参数边界测试；
- prefix caching 文档和示例。

需要中级能力：

- scheduler 相关测试；
- KV cache manager edge case；
- model runner 行为修复；
- quantization 配置修复；
- attention backend 选择逻辑。

高级贡献：

- scheduler 策略改动；
- KV cache 管理策略；
- speculative decoding；
- multi-GPU / distributed serving；
- kernel / backend 优化。

## SGLang 贡献切入点

适合初学者：

- docs；
- examples；
- OpenAI-compatible API 示例；
- structured output 示例；
- server 参数说明；
- issue reproduction；
- schema / regex 边界 case。

需要中级能力：

- radix cache 测试；
- structured output regression test；
- runtime scheduler 行为分析；
- streaming 行为修复；
- offline engine 示例。

高级贡献：

- runtime scheduler；
- radix cache 策略；
- constrained decoding backend；
- speculative decoding；
- distributed serving；
- backend / kernel 优化。

## 维护自己的学习记录

建议在本仓库或个人笔记中维护：

```text
notes/
├── paper_notes/
├── source_notes/
├── benchmark_logs/
├── issue_reproductions/
└── pr_history.md
```

`pr_history.md` 模板：

```markdown
# PR History

## PR title

- Project:
- Link:
- Type: docs / example / test / bugfix / benchmark
- Problem:
- Change:
- Validation:
- Review feedback:
- Lesson:
```

## 最终目标

当你能稳定做到下面事情时，就已经从“学习者”进入“可贡献者”：

1. 看到 issue 后能判断是否适合自己；
2. 能在本地复现并写清楚环境；
3. 能读懂相关模块主路径；
4. 能补一个最小测试或最小示例；
5. 能解释改动对 latency、throughput、memory 或 API 行为的影响。
