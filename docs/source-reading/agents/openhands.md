# OpenHands source reading

## 1. Question this project answers

- Layer: agent-runtime.
- Route connection: Sandbox/runtime/controller architecture for coding agents.
- Reading goal: identify the entrypoint, core state, execution loop, resource boundary, and observable metrics.

## 2. Version and source scope

| Field | Value |
|---|---|
| upstream | https://github.com/OpenHands/openhands |
| local path | `vendor/OpenHands/openhands` |
| commit | `121509e` |
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
| `vendor/OpenHands/openhands/openhands/__init__.py` | entry/config | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/OpenHands/openhands/openhands/analytics/EVENTS.md` | core state | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/OpenHands/openhands/openhands/analytics/__init__.py` | core state | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/OpenHands/openhands/openhands/analytics/analytics_constants.py` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/OpenHands/openhands/openhands/analytics/analytics_context.py` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/OpenHands/openhands/openhands/analytics/analytics_service.py` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/OpenHands/openhands/openhands/analytics/oss_install_id.py` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/OpenHands/openhands/openhands/analytics/user_base.py` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/OpenHands/openhands/openhands/analytics/user_provider.py` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/OpenHands/openhands/openhands/app_server/README.md` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |

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
git submodule update --init --depth 1 vendor/OpenHands/openhands
git -C vendor/OpenHands/openhands rev-parse --short HEAD
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

- Upstream repository: https://github.com/OpenHands/openhands
- [Source reading map](/source-reading/)
- [System principles](/systems/)
