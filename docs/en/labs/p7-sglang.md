# P7 SGLang Lab

## Goal

Run SGLang minimal service and connect lab results to SGLang source reading.

## Commands

```bash
git submodule update --init --depth 1 vendor/sgl-project/sglang
```

Start a server in a CUDA environment supported by SGLang, and record TTFT, TPOT, tokens/s, and prefix cache behavior.

## Pass Criteria

You can explain the relationship between runtime, scheduler, RadixAttention/prefix cache, and model runner.
