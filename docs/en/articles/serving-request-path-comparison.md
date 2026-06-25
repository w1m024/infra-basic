# Serving Request Path Comparison

Comparison targets: vLLM, SGLang, TGI, LMDeploy, TensorRT-LLM.

## Request Entry

vLLM and SGLang are both suitable for tracing requests from the OpenAI-compatible server entry. TGI leans more toward production service processes and router/server layering. LMDeploy provides both TurboMind and PyTorch paths. TensorRT-LLM requires separating Python API, C++ runtime, engine, and Triton backend.

## Scheduler

vLLM is suitable for establishing the mainline of continuous batching, paged KV cache, and worker execution. SGLang is suitable for observing how prefix cache/RadixAttention affects scheduling. TensorRT-LLM is better for studying how NVIDIA runtime organizes overlap, paged attention, and engine.

## KV Cache

KV cache is the system boundary between serving engine and attention backend: the upper layer decides blocks, reuse, release, and metrics, while the lower layer executes attention according to layout.

## Streaming and Metrics

When reading, confirm when tokens return from the model execution path to the API layer, and whether metrics are collected at the request layer, scheduler layer, or worker/backend layer.

## Which to Read First

Recommended order: vLLM → SGLang → TensorRT-LLM → TGI/LMDeploy. First read the Python main path, then enter C++/runtime optimization.
