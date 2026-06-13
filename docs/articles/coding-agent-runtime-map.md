# Coding Agent Runtime Map

覆盖：Codex、Gemini CLI、Aider、OpenHands、SWE-agent / mini-swe-agent，Cline/Roo/Continue/OpenCode 作为对照。

## 最小闭环

```text
task
→ context builder
→ model turn
→ tool call
→ file/shell/browser action
→ observation
→ verification
→ final patch or trajectory
```

## Agent 类型差异

Terminal agent 关注 shell、patch、sandbox、approval。IDE agent 关注 editor state、diff review、context providers。Cloud agent 关注 runtime isolation、browser/file tools 和 long-running task。Research agent 关注 SWE-bench、trajectory 和 reproducibility。

## 拆解维度

- tool system：工具如何注册、校验和执行。
- context：仓库、文件、历史和外部资源如何进入 prompt。
- edit：patch、rewrite、diff review 如何组织。
- verification：测试、lint、benchmark、trajectory 如何证明修改有效。

## 反哺本仓库

读 agent runtime 后，可以把本仓库的源码文章更新、link check、vendor manifest check 和文章质量门禁做成可自动执行任务。
