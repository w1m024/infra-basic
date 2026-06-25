# Coding Agent 全景

本页用于跟踪当前值得研究的 coding agent。筛选标准不是“谁最好用”，而是：是否有明确 agent runtime、是否能读到源码或架构材料、是否体现了不同的系统设计取舍。

## 分类总览

| 类别 | 代表项目 | 研究重点 |
|---|---|---|
| Terminal-native coding agent | OpenAI Codex、Claude Code、Gemini CLI、Aider、OpenCode | CLI session、tool calling、shell/file edit、patch、context management |
| IDE agent | Cline、Roo Code、Continue | editor integration、diff review、MCP、mode system、human-in-the-loop |
| Cloud / background agent | GitHub Copilot cloud agent、Codex cloud、OpenHands cloud | isolated runtime、branch/PR workflow、logs、approval、scaling |
| Research / benchmark agent | SWE-agent、mini-swe-agent | issue-to-patch loop、SWE-bench、minimal agent architecture |
| Agent platform / SDK | OpenHands SDK、Continue checks | composable runtime、multi-agent orchestration、CI/status-check integration |

## 当前重点 Agent

| Agent | 入口 | 为什么值得读 |
|---|---|---|
| OpenAI Codex | https://github.com/openai/codex | 终端 coding agent，适合研究 model session、tool dispatcher、patch/edit、安全边界 |
| Claude Code | https://github.com/anthropics/claude-code | 典型 terminal agentic coding tool，适合研究 long-horizon coding workflow 和 repo memory |
| Gemini CLI | https://github.com/google-gemini/gemini-cli | 官方文档明确提到 ReAct loop、built-in tools 和 MCP server，适合研究标准 agent loop |
| GitHub Copilot cloud agent | https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent | 云端后台 agent，适合研究 issue-to-branch-to-PR 模式 |
| Aider | https://github.com/aider-ai/aider | 老牌终端 pair-programming agent，适合研究 repository map、git-aware edit 和 test loop |
| OpenHands | https://github.com/OpenHands/openhands | 开源 cloud coding agent platform，适合研究 agent SDK、runtime 和 sandbox |
| SWE-agent | https://swe-agent.com/latest/ | 面向 GitHub issue 修复和 SWE-bench 的研究型 agent，适合理解最小闭环 |
| Cline / Roo Code | https://github.com/cline/cline / https://github.com/RooCodeInc/Roo-Code | IDE 内自治 agent，适合研究 Plan/Act、MCP、mode、diff review |
| OpenCode / Continue | https://opencode.ai/ / https://github.com/continuedev/continue | 分别代表 terminal open agent 与 source-controlled AI checks / IDE agent |

## 横向比较维度

读源码时不要只看模型调用。建议固定比较这些系统问题：

1. Runtime 形态：terminal、IDE、cloud、CI；
2. Agent loop：ReAct、plan/act、issue-to-PR、chat-mode edit；
3. Tool system：shell、filesystem、browser、MCP、GitHub、CI；
4. Context strategy：repo map、file selection、memory、compaction、retrieval；
5. Edit model：patch、direct file write、editor diff、branch commit；
6. Safety model：sandbox、approval、human review、permissions；
7. Verification：lint、test、build、status check、benchmark；
8. Observability：tool trace、logs、diff、PR comments、agent session record。

## 推荐阅读顺序

```text
SWE-agent / mini-swe-agent
→ Aider
→ OpenAI Codex / Gemini CLI
→ Cline / Roo Code
→ OpenHands
→ GitHub Copilot cloud agent / Codex cloud
```

这个顺序从最小可理解 agent loop 开始，再进入复杂的产品化 runtime 和云端执行环境。
