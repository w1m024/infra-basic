# Cline / Roo Code / Roo Code Docs source reading

This page covers multiple same-layer vendor projects.

## Cline

> This page is a coverage article for a P1/P2 project. Main-path analysis should be expanded when this project becomes a priority.

## 1. Question this project answers

- Layer: ide-agent.
- Route connection: IDE extension agent flow comparison.
- Reading goal: identify the entrypoint, core state, execution loop, resource boundary, and observable metrics.

## 2. Version and source scope

| Field | Value |
|---|---|
| upstream | https://github.com/cline/cline |
| local path | `vendor/cline/cline` |
| commit | `4fc366d` |
| checkout date | 2026-06-13 |
| article owner | OpenCQUT infra-basic |

## 3. Main flow diagram

```text
user task
-> CLI or UI session
-> context builder
-> model turn
-> tool dispatch
-> action and observation
-> verification or trajectory
```

## 4. Source map

| Source path | Module | Why read it | Key question |
|---|---|---|---|
| `vendor/cline/cline/.agents/skills/cline-sdk/SKILL.md` | entry/config | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/cline/cline/.agents/skills/cline-sdk/references/agent/REFERENCE.md` | core state | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/cline/cline/.agents/skills/cline-sdk/references/agent/api.md` | core state | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/cline/cline/.agents/skills/cline-sdk/references/agent/gotchas.md` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/cline/cline/.agents/skills/cline-sdk/references/agent/patterns.md` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |

## 5. Main path notes

### 5.1 Entrypoint

Start from the first entrypoint files in the source map. Confirm how CLI, HTTP API, Python API, extension module, or test harness creates the runtime objects.

### 5.2 Core state

Record request state, runtime config, cache state, communication state, tool state, or kernel launch state. Group fields by user input, scheduler/runtime mutation, and backend/device data.

### 5.3 Execution loop

Trace one input through the loop. Serving projects use schedule/execute/stream. Kernel projects use plan/launch/store. Agent projects use model turn/tool call/verification.

### 5.4 Output and release

Check streaming, metrics, trace, cache release, error propagation, or trajectory records. This is the part that makes the system debuggable and benchmarkable.

## 6. Same-layer comparison

Same-layer comparison: Codex and Gemini CLI are terminal runtimes, Aider is git-aware editing, OpenHands is sandbox/controller oriented, and SWE-agent is benchmark trajectory oriented.

## 7. Minimal experiment

```bash
git submodule update --init --depth 1 vendor/cline/cline
git -C vendor/cline/cline rev-parse --short HEAD
```

Then choose the first three files in the source map and draw the arrows between entrypoint, state object, and main loop. GPU or service projects must also record hardware, driver, CUDA, model, and launch arguments.

## 8. Common mistakes

- Reading only README files instead of real entrypoint files.
- Recording benchmark numbers without commit, hardware, and launch arguments.
- Skipping error handling, resource release, and metrics paths.
- Citing source paths before checking that they exist in the current checkout.

## 9. Review questions

- Where does one request, tool call, or kernel launch enter this project?
- Who creates, mutates, and releases the core state object?
- What design boundary is most useful compared with same-layer projects?

## 10. References

- Upstream repository: https://github.com/cline/cline
- [Source reading map](/source-reading/)
- [System principles](/systems/)


---

## Roo Code

> This page is a coverage article for a P1/P2 project. Main-path analysis should be expanded when this project becomes a priority.

## 1. Question this project answers

- Layer: ide-agent.
- Route connection: Mode system and tool approval comparison with Cline.
- Reading goal: identify the entrypoint, core state, execution loop, resource boundary, and observable metrics.

## 2. Version and source scope

| Field | Value |
|---|---|
| upstream | https://github.com/RooCodeInc/Roo-Code |
| local path | `vendor/RooCodeInc/Roo-Code` |
| commit | `b867ec9` |
| checkout date | 2026-06-13 |
| article owner | OpenCQUT infra-basic |

## 3. Main flow diagram

```text
user task
-> CLI or UI session
-> context builder
-> model turn
-> tool dispatch
-> action and observation
-> verification or trajectory
```

## 4. Source map

| Source path | Module | Why read it | Key question |
|---|---|---|---|
| `vendor/RooCodeInc/Roo-Code/.changeset/README.md` | entry/config | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/RooCodeInc/Roo-Code/.changeset/changelog-config.js` | core state | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/RooCodeInc/Roo-Code/.changeset/config.json` | core state | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/RooCodeInc/Roo-Code/.changeset/v3.54.0.md` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/RooCodeInc/Roo-Code/.dockerignore` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |

## 5. Main path notes

### 5.1 Entrypoint

Start from the first entrypoint files in the source map. Confirm how CLI, HTTP API, Python API, extension module, or test harness creates the runtime objects.

### 5.2 Core state

Record request state, runtime config, cache state, communication state, tool state, or kernel launch state. Group fields by user input, scheduler/runtime mutation, and backend/device data.

### 5.3 Execution loop

Trace one input through the loop. Serving projects use schedule/execute/stream. Kernel projects use plan/launch/store. Agent projects use model turn/tool call/verification.

### 5.4 Output and release

Check streaming, metrics, trace, cache release, error propagation, or trajectory records. This is the part that makes the system debuggable and benchmarkable.

## 6. Same-layer comparison

Same-layer comparison: Codex and Gemini CLI are terminal runtimes, Aider is git-aware editing, OpenHands is sandbox/controller oriented, and SWE-agent is benchmark trajectory oriented.

## 7. Minimal experiment

```bash
git submodule update --init --depth 1 vendor/RooCodeInc/Roo-Code
git -C vendor/RooCodeInc/Roo-Code rev-parse --short HEAD
```

Then choose the first three files in the source map and draw the arrows between entrypoint, state object, and main loop. GPU or service projects must also record hardware, driver, CUDA, model, and launch arguments.

## 8. Common mistakes

- Reading only README files instead of real entrypoint files.
- Recording benchmark numbers without commit, hardware, and launch arguments.
- Skipping error handling, resource release, and metrics paths.
- Citing source paths before checking that they exist in the current checkout.

## 9. Review questions

- Where does one request, tool call, or kernel launch enter this project?
- Who creates, mutates, and releases the core state object?
- What design boundary is most useful compared with same-layer projects?

## 10. References

- Upstream repository: https://github.com/RooCodeInc/Roo-Code
- [Source reading map](/source-reading/)
- [System principles](/systems/)


---

## Roo Code Docs

> This page is a coverage article for a P1/P2 project. Main-path analysis should be expanded when this project becomes a priority.

## 1. Question this project answers

- Layer: extension-reference.
- Route connection: Documentation reference, not primary source.
- Reading goal: identify the entrypoint, core state, execution loop, resource boundary, and observable metrics.

## 2. Version and source scope

| Field | Value |
|---|---|
| upstream | https://github.com/RooCodeInc/Roo-Code-Docs |
| local path | `vendor/RooCodeInc/Roo-Code-Docs` |
| commit | `a676c41` |
| checkout date | 2026-06-13 |
| article owner | OpenCQUT infra-basic |

## 3. Main flow diagram

```text
HTTP or CLI request
-> tokenizer and request parser
-> scheduler
-> KV cache manager
-> model runner or backend
-> streaming response
```

## 4. Source map

| Source path | Module | Why read it | Key question |
|---|---|---|---|
| `vendor/RooCodeInc/Roo-Code-Docs/.env.example` | entry/config | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/RooCodeInc/Roo-Code-Docs/.github/CODEOWNERS` | core state | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/RooCodeInc/Roo-Code-Docs/.github/workflows/docusaurus-build.yml` | core state | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/RooCodeInc/Roo-Code-Docs/.gitignore` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/RooCodeInc/Roo-Code-Docs/.husky/pre-commit` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |

## 5. Main path notes

### 5.1 Entrypoint

Start from the first entrypoint files in the source map. Confirm how CLI, HTTP API, Python API, extension module, or test harness creates the runtime objects.

### 5.2 Core state

Record request state, runtime config, cache state, communication state, tool state, or kernel launch state. Group fields by user input, scheduler/runtime mutation, and backend/device data.

### 5.3 Execution loop

Trace one input through the loop. Serving projects use schedule/execute/stream. Kernel projects use plan/launch/store. Agent projects use model turn/tool call/verification.

### 5.4 Output and release

Check streaming, metrics, trace, cache release, error propagation, or trajectory records. This is the part that makes the system debuggable and benchmarkable.

## 6. Same-layer comparison

Same-layer comparison: vLLM is the best first scheduler/KV-cache reading target, SGLang highlights prefix cache and structured generation, and TensorRT-LLM highlights NVIDIA runtime/backend optimization.

## 7. Minimal experiment

```bash
git submodule update --init --depth 1 vendor/RooCodeInc/Roo-Code-Docs
git -C vendor/RooCodeInc/Roo-Code-Docs rev-parse --short HEAD
```

Then choose the first three files in the source map and draw the arrows between entrypoint, state object, and main loop. GPU or service projects must also record hardware, driver, CUDA, model, and launch arguments.

## 8. Common mistakes

- Reading only README files instead of real entrypoint files.
- Recording benchmark numbers without commit, hardware, and launch arguments.
- Skipping error handling, resource release, and metrics paths.
- Citing source paths before checking that they exist in the current checkout.

## 9. Review questions

- Where does one request, tool call, or kernel launch enter this project?
- Who creates, mutates, and releases the core state object?
- What design boundary is most useful compared with same-layer projects?

## 10. References

- Upstream repository: https://github.com/RooCodeInc/Roo-Code-Docs
- [Source reading map](/source-reading/)
- [System principles](/systems/)
