# One Month Plan

This plan compresses the `infra-basic` learning path into a 4-week executable cycle. The goal is to complete the LLM inference infrastructure entry loop: run small model inference, understand operator / kernel / CUDA/GPU programming model, complete KV cache experiments, build toy serving, run vLLM and SGLang minimal experiments, and prepare for first open source contribution.

## Week 1: Environment & Basics

- Confirm CUDA / PyTorch / driver environment
- Run minimal inference with small models
- Understand tensor, dtype, device, memory, profiler

## Week 2: Operator / Kernel & System

- Understand Python → operator → kernel path
- Learn Triton/CUDA kernel basics
- Study prefill/decode, KV cache, scheduler

## Week 3: Source Reading

- Read vLLM entry points and main loop
- Read SGLang entry points and main loop
- Understand serving engine architecture

## Week 4: Lab & Contribution

- Build minimal serving experiment
- Prepare first PR (docs, test, or bug fix)
- Complete benchmark and reproduction records
