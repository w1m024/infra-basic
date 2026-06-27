import type { DefaultTheme } from 'vitepress'

export const sidebarEn: DefaultTheme.Sidebar = [
  {
    text: 'Getting Started',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/en/start/' },
      { text: 'Learning Roadmap', link: '/en/start/roadmap' },
      { text: 'One Month Plan', link: '/en/start/one-month-plan' },
      { text: 'Environment & CUDA', link: '/en/start/environment' }
    ]
  },
  {
    text: 'Inference Systems',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/en/systems/' },
      { text: 'System Overview', link: '/en/systems/overview' },
      { text: 'Prefill / Decode', link: '/en/systems/prefill-decode' },
      { text: 'KV Cache', link: '/en/systems/kv-cache' },
      { text: 'Scheduler & Batching', link: '/en/systems/scheduler-batching' },
      { text: 'Serving API & Streaming', link: '/en/systems/serving-api-streaming' },
      { text: 'Benchmark & Profiling', link: '/en/systems/benchmark-profiling' },
      { text: 'Distributed Inference', link: '/en/systems/distributed-inference' },
      { text: 'Production Serving', link: '/en/systems/production-serving' }
    ]
  },
  {
    text: 'Source Reading',
    collapsed: false,
    items: [
      { text: 'Source Reading Map', link: '/en/source-reading/' },
      {
        text: 'Serving Engines',
        collapsed: false,
        items: [
          { text: 'vLLM', link: '/en/source-reading/serving/vllm' },
          { text: 'vLLM Study Plan', link: '/en/source-reading/serving/vllm-study-plan' },
          { text: 'SGLang', link: '/en/source-reading/serving/sglang' },
          { text: 'SGLang Study Plan', link: '/en/source-reading/serving/sglang-study-plan' },
          { text: 'TensorRT-LLM', link: '/en/source-reading/serving/tensorrt-llm' },
          { text: 'TGI', link: '/en/source-reading/serving/tgi' },
          { text: 'LMDeploy', link: '/en/source-reading/serving/lmdeploy' },
          { text: 'llama.cpp / ggml', link: '/en/source-reading/serving/llama-cpp-ggml' }
        ]
      },
      {
        text: 'Kernel Libraries',
        collapsed: false,
        items: [
          { text: 'FlashInfer', link: '/en/source-reading/kernels/flashinfer' },
          { text: 'FlashAttention', link: '/en/source-reading/kernels/flash-attention' },
          { text: 'CUTLASS', link: '/en/source-reading/kernels/cutlass' },
          { text: 'Triton', link: '/en/source-reading/kernels/triton' },
          { text: 'FlashMLA', link: '/en/source-reading/kernels/flashmla' },
          { text: 'DeepGEMM', link: '/en/source-reading/kernels/deepgemm' }
        ]
      },
      {
        text: 'Distributed / Cache',
        collapsed: true,
        items: [
          { text: 'Dynamo', link: '/en/source-reading/distributed/dynamo' },
          { text: 'Triton Server', link: '/en/source-reading/distributed/triton-server' },
          { text: 'DeepEP', link: '/en/source-reading/distributed/deepep' },
          { text: '3FS', link: '/en/source-reading/distributed/3fs' },
          { text: 'LMCache', link: '/en/source-reading/distributed/lmcache' }
        ]
      },
      {
        text: 'Agent Runtime',
        collapsed: true,
        items: [
          { text: 'Codex', link: '/en/source-reading/agents/codex' },
          { text: 'Claude Code', link: '/en/source-reading/agents/claude-code' },
          { text: 'Gemini CLI', link: '/en/source-reading/agents/gemini-cli' },
          { text: 'Aider', link: '/en/source-reading/agents/aider' },
          { text: 'OpenHands', link: '/en/source-reading/agents/openhands' },
          { text: 'Cline / Roo', link: '/en/source-reading/agents/cline-roo' },
          { text: 'OpenCode / Continue', link: '/en/source-reading/agents/opencode-continue' },
          { text: 'SWE-agent', link: '/en/source-reading/agents/swe-agent' }
        ]
      }
    ]
  },
  {
    text: 'Labs',
    collapsed: false,
    items: [
      { text: 'Lab Overview', link: '/en/labs/' },
      { text: 'PyTorch CUDA', link: '/en/labs/torch-cuda' },
      { text: 'Transformers Generation', link: '/en/labs/transformers-generation' },
      { text: 'Toy Serving', link: '/en/labs/toy-serving' },
      { text: 'vLLM', link: '/en/labs/vllm' },
      { text: 'SGLang', link: '/en/labs/sglang' },
      { text: 'First PR', link: '/en/labs/first-pr' }
    ]
  },
  {
    text: 'Reference',
    collapsed: false,
    items: [
      { text: 'Operator / Kernel Guide', link: '/en/reference/operator-kernel-guide' },
      { text: 'CUDA GPU Guide', link: '/en/reference/cuda-gpu-guide' },
      { text: 'Glossary', link: '/en/reference/glossary' },
      { text: 'Bibliography', link: '/en/reference/bibliography' },
      { text: 'Troubleshooting', link: '/en/reference/troubleshooting' },
      { text: 'Open Source Playbook', link: '/en/reference/open-source-playbook' }
    ]
  },
  {
    text: 'Articles & Resources',
    collapsed: false,
    items: [
      { text: 'Article Index', link: '/en/articles/' },
      { text: 'How to Read Vendor Source', link: '/en/articles/how-to-read-vendor-source' },
      { text: 'Serving Request Path Comparison', link: '/en/articles/serving-request-path-comparison' },
      { text: 'Attention Backend Map', link: '/en/articles/attention-backend-map' },
      { text: 'DeepSeek Infrastructure Stack', link: '/en/articles/deepseek-infra-stack-map' },
      { text: 'Coding Agent Runtime', link: '/en/articles/coding-agent-runtime-map' },
      { text: 'Paper Syllabus', link: '/en/articles/paper-syllabus' }
    ]
  }
]
