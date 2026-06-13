# Serving 请求路径对比

比较对象：vLLM、SGLang、TGI、LMDeploy、TensorRT-LLM。

## 请求入口

vLLM 和 SGLang 都适合从 OpenAI-compatible server 入口追踪请求。TGI 更偏生产服务进程和 router/server 分层。LMDeploy 同时提供 TurboMind 和 PyTorch 路径。TensorRT-LLM 需要把 Python API、C++ runtime、engine 和 Triton backend 分开看。

## Scheduler

vLLM 适合建立 continuous batching、paged KV cache 和 worker 执行的主线。SGLang 适合观察 prefix cache/RadixAttention 如何影响调度。TensorRT-LLM 更适合研究 NVIDIA runtime 对 overlap、paged attention、engine 的组织方式。

## KV Cache

KV cache 是 serving engine 和 attention backend 的系统边界：上层决定 block、复用、释放和指标，下层负责按布局执行 attention。

## Streaming 和 metrics

阅读时要确认 token 何时从模型执行路径返回 API 层，metrics 是在请求层、scheduler 层还是 worker/backend 层采集。

## 从零开始读哪个

建议顺序：vLLM → SGLang → TensorRT-LLM → TGI/LMDeploy。先读 Python 主路径，再进入 C++/runtime 优化。
