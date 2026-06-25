# Coding Agent Runtime

Coverage: Codex, Gemini CLI, Aider, OpenHands, SWE-agent / mini-swe-agent, with Cline/Roo/Continue/OpenCode as reference.

## Minimal Loop

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

## Agent Type Differences

Terminal agents focus on shell, patch, sandbox, approval. IDE agents focus on editor state, diff review, context providers. Cloud agents focus on runtime isolation, browser/file tools, and long-running tasks. Research agents focus on SWE-bench, trajectory, and reproducibility.

## Decomposition Dimensions

- Tool system: How tools are registered, validated, and executed.
- Context: How repositories, files, history, and external resources enter the prompt.
- Edit: How patch, rewrite, and diff review are organized.
- Verification: How tests, lint, benchmark, and trajectory prove modifications are effective.
