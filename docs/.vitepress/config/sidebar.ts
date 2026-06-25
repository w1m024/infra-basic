import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = [
  {
    text: '开始',
    collapsed: false,
    items: [
      { text: '从零开始', link: '/start/' },
      { text: '学习路线', link: '/start/roadmap' },
      { text: '一月计划', link: '/start/one-month-plan' },
      { text: '环境与 CUDA 路线', link: '/start/environment' }
    ]
  },
  {
    text: '系统原理',
    collapsed: false,
    items: [
      { text: '系统概览', link: '/systems/' },
      { text: '推理系统总览', link: '/systems/overview' },
      { text: 'Prefill / Decode', link: '/systems/prefill-decode' },
      { text: 'KV Cache', link: '/systems/kv-cache' },
      { text: '调度与批处理', link: '/systems/scheduler-batching' },
      { text: 'Serving API 与 Streaming', link: '/systems/serving-api-streaming' },
      { text: 'Benchmark 与 Profiling', link: '/systems/benchmark-profiling' },
      { text: '分布式推理', link: '/systems/distributed-inference' },
      { text: '生产级 Serving', link: '/systems/production-serving' }
    ]
  },
  {
    text: '源码阅读',
    collapsed: false,
    items: [
      { text: '源码阅读地图', link: '/source-reading/' },
      {
        text: 'Serving 引擎',
        collapsed: false,
        items: [
          { text: 'vLLM', link: '/source-reading/serving/vllm' },
          { text: 'SGLang', link: '/source-reading/serving/sglang' },
          { text: 'TensorRT-LLM', link: '/source-reading/serving/tensorrt-llm' },
          { text: 'TGI', link: '/source-reading/serving/tgi' },
          { text: 'LMDeploy', link: '/source-reading/serving/lmdeploy' },
          { text: 'llama.cpp / ggml', link: '/source-reading/serving/llama-cpp-ggml' }
        ]
      },
      {
        text: 'Kernel 库',
        collapsed: false,
        items: [
          { text: 'FlashInfer', link: '/source-reading/kernels/flashinfer' },
          { text: 'FlashAttention', link: '/source-reading/kernels/flash-attention' },
          { text: 'CUTLASS', link: '/source-reading/kernels/cutlass' },
          { text: 'Triton', link: '/source-reading/kernels/triton' },
          { text: 'FlashMLA', link: '/source-reading/kernels/flashmla' },
          { text: 'DeepGEMM', link: '/source-reading/kernels/deepgemm' }
        ]
      },
      {
        text: '分布式 / 缓存',
        collapsed: true,
        items: [
          { text: 'Dynamo', link: '/source-reading/distributed/dynamo' },
          { text: 'Triton Server', link: '/source-reading/distributed/triton-server' },
          { text: 'DeepEP', link: '/source-reading/distributed/deepep' },
          { text: '3FS', link: '/source-reading/distributed/3fs' },
          { text: 'LMCache', link: '/source-reading/distributed/lmcache' }
        ]
      },
      {
        text: 'Agent 运行时',
        collapsed: true,
        items: [
          { text: 'Codex', link: '/source-reading/agents/codex' },
          { text: 'Claude Code', link: '/source-reading/agents/claude-code' },
          { text: 'Gemini CLI', link: '/source-reading/agents/gemini-cli' },
          { text: 'Aider', link: '/source-reading/agents/aider' },
          { text: 'OpenHands', link: '/source-reading/agents/openhands' },
          { text: 'Cline / Roo', link: '/source-reading/agents/cline-roo' },
          { text: 'OpenCode / Continue', link: '/source-reading/agents/opencode-continue' },
          { text: 'SWE-agent', link: '/source-reading/agents/swe-agent' }
        ]
      }
    ]
  },
  {
    text: '实验项目',
    collapsed: false,
    items: [
      { text: '实验总览', link: '/labs/' },
      { text: 'PyTorch CUDA', link: '/labs/p0-torch-cuda' },
      { text: 'Operator / Kernel 实验', link: '/labs/p1-operator-kernel' },
      { text: 'CUDA GPU 编程', link: '/labs/p2-cuda-gpu' },
      { text: 'Toy Serving 实验', link: '/labs/p5-toy-serving' },
      { text: 'vLLM 实验', link: '/labs/p6-vllm' },
      { text: 'SGLang 实验', link: '/labs/p7-sglang' },
      { text: '第一个 PR', link: '/labs/p9-first-pr' }
    ]
  },
  {
    text: '文章与资源',
    collapsed: false,
    items: [
      { text: '文章索引', link: '/articles/' },
      { text: '如何读 vendor 源码', link: '/articles/how-to-read-vendor-source' },
      { text: 'Serving 请求路径对比', link: '/articles/serving-request-path-comparison' },
      { text: 'Attention Backend 地图', link: '/articles/attention-backend-map' },
      { text: 'DeepSeek 基础设施全景', link: '/articles/deepseek-infra-stack-map' },
      { text: 'Coding Agent 运行时', link: '/articles/coding-agent-runtime-map' },
      { text: '论文路线', link: '/articles/paper-syllabus' },
      { text: '术语表', link: '/reference/glossary' },
      { text: '参考文献', link: '/reference/bibliography' },
      { text: '问题排查', link: '/reference/troubleshooting' },
      { text: '开源贡献手册', link: '/reference/open-source-playbook' }
    ]
  }
]
