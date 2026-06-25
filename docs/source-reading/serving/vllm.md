# vLLM 源码阅读

## 1. 本项目要回答的问题

- Layer: serving-engine.
- Route connection: OpenAI-compatible serving, scheduler, KV cache, worker and attention backend mainline.
- Reading goal: identify the entrypoint, core state, execution loop, resource boundary, and observable metrics.

## 2. 版本与源码范围

| 字段 | 值 |
|---|---|
| upstream | https://github.com/vllm-project/vllm |
| local path | `vendor/vllm-project/vllm` |
| commit | `5b2943f` |
| checkout date | 2026-06-13 |
| article owner | OpenCQUT infra-basic |

## 3. 主流程图

```text
HTTP or CLI request
-> tokenizer and request parser
-> scheduler
-> KV cache manager
-> model runner or backend
-> streaming response
```

## 4. 源码地图

| Source path | Module | Why read it | Key question |
|---|---|---|---|
| `vendor/vllm-project/vllm/vllm/entrypoints/__init__.py` | entry/config | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/vllm-project/vllm/vllm/entrypoints/anthropic/__init__.py` | core state | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/vllm-project/vllm/vllm/entrypoints/anthropic/api_router.py` | core state | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/vllm-project/vllm/vllm/entrypoints/anthropic/protocol.py` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/vllm-project/vllm/vllm/entrypoints/anthropic/serving.py` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/vllm-project/vllm/vllm/entrypoints/api_server.py` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/vllm-project/vllm/vllm/entrypoints/chat_utils.py` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/vllm-project/vllm/vllm/entrypoints/cli/__init__.py` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/vllm-project/vllm/vllm/entrypoints/cli/benchmark/__init__.py` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/vllm-project/vllm/vllm/entrypoints/cli/benchmark/base.py` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |

## 5. 主路径笔记

### 5.1 Entrypoint

Start from the first entrypoint files in the source map. Confirm how CLI, HTTP API, Python API, extension module, or test harness creates the runtime objects.

### 5.2 Core state

Record request state, runtime config, cache state, communication state, tool state, or kernel launch state. Group fields by user input, scheduler/runtime mutation, and backend/device data.

### 5.3 Execution loop

Trace one input through the loop. Serving projects use schedule/execute/stream. Kernel projects use plan/launch/store. Agent projects use model turn/tool call/verification.

### 5.4 Output and release

Check streaming, metrics, trace, cache release, error propagation, or trajectory records. This is the part that makes the system debuggable and benchmarkable.

## 6. 同层对比

Same-layer comparison: vLLM is the best first scheduler/KV-cache reading target, SGLang highlights prefix cache and structured generation, and TensorRT-LLM highlights NVIDIA runtime/backend optimization.

## 7. 最小实验

```bash
git submodule update --init --depth 1 vendor/vllm-project/vllm
git -C vendor/vllm-project/vllm rev-parse --short HEAD
```

Then choose the first three files in the source map and draw the arrows between entrypoint, state object, and main loop. GPU or service projects must also record hardware, driver, CUDA, model, and launch arguments.

## 8. 常见错误

- Reading only README files instead of real entrypoint files.
- Recording benchmark numbers without commit, hardware, and launch arguments.
- Skipping error handling, resource release, and metrics paths.
- Citing source paths before checking that they exist in the current checkout.

## 9. 回顾问题

- Where does one request, tool call, or kernel launch enter this project?
- Who creates, mutates, and releases the core state object?
- What design boundary is most useful compared with same-layer projects?

## 10. 参考资料

- Upstream repository: https://github.com/vllm-project/vllm
- [Source reading map](/source-reading/)
- [System principles](/systems/)
