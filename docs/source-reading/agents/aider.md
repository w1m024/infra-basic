# Aider source reading

## 1. Question this project answers

- Layer: agent-runtime.
- Route connection: Repo map, git-aware edit loop and test loop.
- Reading goal: identify the entrypoint, core state, execution loop, resource boundary, and observable metrics.

## 2. Version and source scope

| Field | Value |
|---|---|
| upstream | https://github.com/aider-ai/aider |
| local path | `vendor/aider-ai/aider` |
| commit | `5dc9490` |
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
| `vendor/aider-ai/aider/aider/__init__.py` | entry/config | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/aider-ai/aider/aider/__main__.py` | core state | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/aider-ai/aider/aider/analytics.py` | core state | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/aider-ai/aider/aider/args.py` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/aider-ai/aider/aider/args_formatter.py` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/aider-ai/aider/aider/coders/__init__.py` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/aider-ai/aider/aider/coders/architect_coder.py` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/aider-ai/aider/aider/coders/architect_prompts.py` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/aider-ai/aider/aider/coders/ask_coder.py` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/aider-ai/aider/aider/coders/ask_prompts.py` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |

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
git submodule update --init --depth 1 vendor/aider-ai/aider
git -C vendor/aider-ai/aider rev-parse --short HEAD
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

- Upstream repository: https://github.com/aider-ai/aider
- [Source reading map](/source-reading/)
- [System principles](/systems/)
