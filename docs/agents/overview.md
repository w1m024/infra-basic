# Agent / Codex 内部机制

本栏目关注 Agent 与 OpenAI Codex CLI 的原理和源码，而不是使用教程。目标是理解 coding agent 如何组织上下文、调用工具、执行命令、应用补丁、处理 sandbox / approval，以及如何把 LLM 推理能力封装成一个可工作的工程代理。

## 学习目标

完成本栏目后，应该能够：

1. 解释 coding agent 的基本 loop：observe、plan、act、verify；
2. 理解 system / developer / user prompt 如何共同约束 agent 行为；
3. 理解 tool calling、shell command、file edit、patch apply 和 browser automation 的边界；
4. 理解 sandbox、approval policy、workspace trust 和 destructive action guardrail；
5. 阅读 Codex CLI 或同类 agent 项目的源码主路径，定位一次请求如何变成多轮工具调用；
6. 对比 agent runtime 与 LLM serving runtime 的相似点和差异。

## 建议主题

| 主题 | 目标 |
|---|---|
| Agent loop | 研究 agent 如何在多轮中观察环境、选择动作、执行工具和更新状态 |
| Prompt hierarchy | 理解 system / developer / user / tool result 的优先级和冲突处理 |
| Tool calling | 理解工具 schema、参数生成、结果回填、错误恢复和并行工具调用 |
| File editing | 理解 apply patch、diff、dirty worktree、最小修改和防止误删的机制 |
| Sandbox / approval | 理解命令权限、网络权限、文件系统边界和危险操作拦截 |
| Context management | 理解上下文窗口、摘要压缩、检索、文件选择和长期任务续跑 |
| Verification loop | 理解测试、构建、浏览器检查和失败重试如何闭环 |
| Codex CLI source path | 沿 CLI entrypoint、session、model client、tool dispatcher、patch executor 读源码 |

## 源码阅读顺序

```text
CLI entrypoint
→ config / profile / workspace loading
→ conversation session
→ model request / streaming response
→ tool call parser / dispatcher
→ shell / file / patch / browser tool adapters
→ sandbox / approval handling
→ verification / final response
```

阅读时重点回答：

1. 一次用户请求如何被转换成模型输入；
2. 工具调用结果如何进入下一轮上下文；
3. agent 如何决定继续执行还是结束；
4. 文件修改如何生成、校验和应用；
5. 命令执行如何处理权限、超时、输出截断和错误；
6. 上下文压缩后如何保持任务连续性；
7. 与普通 chat completion 相比，agent runtime 多了哪些状态和控制逻辑。

## 与 LLM Infra 主线的关系

Agent 系统和 LLM serving 系统关注点不同，但有相似的系统问题：

| 维度 | LLM Serving | Coding Agent |
|---|---|---|
| 核心循环 | prefill / decode / schedule | observe / act / verify |
| 状态管理 | request、KV cache、scheduler state | conversation、workspace、tool state |
| 资源边界 | GPU memory、batch token、latency SLO | sandbox、approval、context window、filesystem |
| 失败处理 | OOM、timeout、backend fallback | command failure、patch conflict、test failure |
| 可观测性 | TTFT、TPOT、tokens/s、GPU util | tool trace、diff、test log、final summary |

## 后续可补内容

- Codex CLI 源码入口和模块图；
- tool calling 协议与 function schema；
- apply patch / diff executor 的实现细节；
- sandbox 与 approval policy 的设计；
- context compaction 和 long-running task 的实现；
- coding agent 与 browser / GitHub / Figma 等外部工具的集成边界；
- agent benchmark 与代码修改质量评估。

## 代表性 Agent 章节

- [Popular Agent Landscape](/agents/landscape)
- [OpenAI Codex](/agents/openai-codex)
- [Claude Code](/agents/claude-code)
- [Gemini CLI](/agents/gemini-cli)
- [GitHub Copilot Agent](/agents/github-copilot-agent)
- [Aider](/agents/aider)
- [OpenHands](/agents/openhands)
- [SWE-agent](/agents/swe-agent)
- [Cline / Roo Code](/agents/cline-roo)
- [OpenCode / Continue](/agents/opencode-continue)
