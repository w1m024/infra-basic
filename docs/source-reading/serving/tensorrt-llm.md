# TensorRT-LLM source reading

## 1. Question this project answers

- Layer: serving-engine.
- Route connection: NVIDIA optimized LLM inference runtime and engine stack.
- Reading goal: identify the entrypoint, core state, execution loop, resource boundary, and observable metrics.

## 2. Version and source scope

| Field | Value |
|---|---|
| upstream | https://github.com/NVIDIA/TensorRT-LLM |
| local path | `vendor/NVIDIA/TensorRT-LLM` |
| commit | `bb32597` |
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
| `vendor/NVIDIA/TensorRT-LLM/tensorrt_llm/__init__.py` | entry/config | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/NVIDIA/TensorRT-LLM/tensorrt_llm/_common.py` | core state | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/NVIDIA/TensorRT-LLM/tensorrt_llm/_deprecation.py` | core state | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/NVIDIA/TensorRT-LLM/tensorrt_llm/_dlpack_utils.py` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/NVIDIA/TensorRT-LLM/tensorrt_llm/_ipc_utils.py` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/NVIDIA/TensorRT-LLM/tensorrt_llm/_mnnvl_utils.py` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/NVIDIA/TensorRT-LLM/tensorrt_llm/_ray_utils.py` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/NVIDIA/TensorRT-LLM/tensorrt_llm/_tensorrt_engine/__init__.py` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/NVIDIA/TensorRT-LLM/tensorrt_llm/_torch/__init__.py` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/NVIDIA/TensorRT-LLM/tensorrt_llm/_torch/async_llm.py` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |

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
git submodule update --init --depth 1 vendor/NVIDIA/TensorRT-LLM
git -C vendor/NVIDIA/TensorRT-LLM rev-parse --short HEAD
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

- Upstream repository: https://github.com/NVIDIA/TensorRT-LLM
- [Source reading map](/source-reading/)
- [System principles](/systems/)
