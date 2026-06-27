# Toy Serving 实验

## 目标

用最小 HTTP server 理解请求、streaming、并发和 benchmark 的关系。

## 最小实验

```bash
python projects/toy-serving/server.py
```

如果项目脚本尚未实现，先用 FastAPI 或标准库 HTTP server 写一个只返回 token 序列的 mock server。

## 通过标准

- 能区分 TTFT、TPOT、E2E latency。
- 能解释 streaming 响应何时 flush。
- 能记录并发数变化对延迟的影响。
