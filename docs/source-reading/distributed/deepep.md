# DeepEP 源码阅读

## 1. 本项目要回答的问题

- Layer: distributed-serving.
- Route connection: Expert parallel dispatch/combine communication layer.
- Reading goal: identify the entrypoint, core state, execution loop, resource boundary, and observable metrics.

## 2. 版本与源码范围

| 字段 | 值 |
|---|---|
| upstream | https://github.com/deepseek-ai/DeepEP |
| local path | `vendor/deepseek-ai/DeepEP` |
| commit | `d4f41e4` |
| checkout date | 2026-06-13 |
| article owner | OpenCQUT infra-basic |

## 3. 主流程图

```text
serving engine
-> routing or placement
-> cache or communication planner
-> worker transport
-> metrics and release
```

## 4. 源码地图

| Source path | Module | Why read it | Key question |
|---|---|---|---|
| `vendor/deepseek-ai/DeepEP/deep_ep/__init__.py` | entry/config | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/deepseek-ai/DeepEP/deep_ep/buffers/__init__.py` | core state | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/deepseek-ai/DeepEP/deep_ep/buffers/elastic.py` | core state | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/deepseek-ai/DeepEP/deep_ep/buffers/legacy.py` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/deepseek-ai/DeepEP/deep_ep/include/deep_ep/common/comm.cuh` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/deepseek-ai/DeepEP/deep_ep/include/deep_ep/common/compiled.cuh` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/deepseek-ai/DeepEP/deep_ep/include/deep_ep/common/exception.cuh` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/deepseek-ai/DeepEP/deep_ep/include/deep_ep/common/handle.cuh` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/deepseek-ai/DeepEP/deep_ep/include/deep_ep/common/layout.cuh` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/deepseek-ai/DeepEP/deep_ep/include/deep_ep/common/math.cuh` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |

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
git submodule update --init --depth 1 vendor/deepseek-ai/DeepEP
git -C vendor/deepseek-ai/DeepEP rev-parse --short HEAD
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

- Upstream repository: https://github.com/deepseek-ai/DeepEP
- [Source reading map](/source-reading/)
- [System principles](/systems/)
