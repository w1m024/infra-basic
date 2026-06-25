# DeepGEMM 源码阅读

## 1. 本项目要回答的问题

- Layer: kernel-library.
- Route connection: FP8 GEMM and grouped GEMM kernels.
- Reading goal: identify the entrypoint, core state, execution loop, resource boundary, and observable metrics.

## 2. 版本与源码范围

| 字段 | 值 |
|---|---|
| upstream | https://github.com/deepseek-ai/DeepGEMM |
| local path | `vendor/deepseek-ai/DeepGEMM` |
| commit | `88965b0` |
| checkout date | 2026-06-13 |
| article owner | OpenCQUT infra-basic |

## 3. 主流程图

```text
Python or C++ API
-> shape and dtype checks
-> planner or autotuner
-> CUDA, Triton, or CUTLASS kernel
-> output tensor and metrics
```

## 4. 源码地图

| Source path | Module | Why read it | Key question |
|---|---|---|---|
| `vendor/deepseek-ai/DeepGEMM/deep_gemm/__init__.py` | entry/config | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/deepseek-ai/DeepGEMM/deep_gemm/include/deep_gemm/comm/barrier.cuh` | core state | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/deepseek-ai/DeepGEMM/deep_gemm/include/deep_gemm/common/compile.cuh` | core state | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/deepseek-ai/DeepGEMM/deep_gemm/include/deep_gemm/common/cute_tie.cuh` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/deepseek-ai/DeepGEMM/deep_gemm/include/deep_gemm/common/epilogue_utils.cuh` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/deepseek-ai/DeepGEMM/deep_gemm/include/deep_gemm/common/exception.cuh` | execution loop | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/deepseek-ai/DeepGEMM/deep_gemm/include/deep_gemm/common/math.cuh` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/deepseek-ai/DeepGEMM/deep_gemm/include/deep_gemm/common/reduction.cuh` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/deepseek-ai/DeepGEMM/deep_gemm/include/deep_gemm/common/scheduler.cuh` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |
| `vendor/deepseek-ai/DeepGEMM/deep_gemm/include/deep_gemm/common/sm100_utils.cuh` | resource/test | File exists in current checkout | Track call boundary, state mutation, and error handling |

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

Same-layer comparison: FlashAttention is the IO-aware attention baseline, FlashInfer is serving-oriented, while CUTLASS and Triton are lower-level kernel authoring substrates.

## 7. 最小实验

```bash
git submodule update --init --depth 1 vendor/deepseek-ai/DeepGEMM
git -C vendor/deepseek-ai/DeepGEMM rev-parse --short HEAD
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

- Upstream repository: https://github.com/deepseek-ai/DeepGEMM
- [Source reading map](/source-reading/)
- [System principles](/systems/)
