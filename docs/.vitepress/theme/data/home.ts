export type HomeLink = {
  text: string
  href: string
}

export type StartStep = {
  id: string
  title: string
  summary: string
  output: string
  href: string
}

export type SourceTrack = {
  title: string
  summary: string
  projects: string[]
  href: string
}

export type ValidationItem = {
  title: string
  summary: string
  href: string
}

export const heroLinks: HomeLink[] = [
  { text: '从零开始', href: '/start/' },
  { text: '源码阅读地图', href: '/source-reading/' },
  { text: '一月计划', href: '/start/one-month-plan' }
]

export const startSteps: StartStep[] = [
  {
    id: '01',
    title: '环境与 PyTorch CUDA',
    summary: '确认 NVIDIA CUDA 路径、PyTorch tensor、dtype、显存和 profiler 的基本行为。',
    output: '一份最小推理和 profiler 记录。',
    href: '/start/environment'
  },
  {
    id: '02',
    title: 'Operator / Kernel',
    summary: '理解 Python 调用、operator dispatch、Triton/CUDA kernel 和性能瓶颈的边界。',
    output: '一个 operator 到 kernel 的路径图。',
    href: '/labs/p1-operator-kernel'
  },
  {
    id: '03',
    title: '推理系统主路径',
    summary: '串起 prefill/decode、KV cache、scheduler、streaming 和 benchmark 指标。',
    output: '一张请求从 API 到 token 输出的主流程图。',
    href: '/systems/'
  },
  {
    id: '04',
    title: 'vLLM / SGLang 源码',
    summary: '按入口、状态、循环和资源管理读 serving engine，而不是只读 README。',
    output: '两份源码地图和一次最小实验。',
    href: '/source-reading/serving/vllm'
  },
  {
    id: '05',
    title: '实验与 PR',
    summary: '用 benchmark、bug reproduction、文档或测试进入开源贡献闭环。',
    output: '一个可复现 issue、benchmark 或最小 PR。',
    href: '/labs/p9-first-pr'
  }
]

export const sourceTracks: SourceTrack[] = [
  {
    title: 'Serving 引擎',
    summary: '请求入口、调度、KV cache、worker、模型执行和 streaming。',
    projects: ['vLLM', 'SGLang', 'TGI', 'LMDeploy', 'TensorRT-LLM'],
    href: '/source-reading/serving/vllm'
  },
  {
    title: 'Kernel 库',
    summary: 'attention、GEMM、Triton/CUDA/CUTLASS 抽象和 serving backend 的连接。',
    projects: ['FlashInfer', 'FlashAttention', 'CUTLASS', 'Triton', 'DeepGEMM'],
    href: '/source-reading/kernels/flashinfer'
  },
  {
    title: 'DeepSeek / MoE',
    summary: 'MLA、FP8 GEMM、expert parallel 通信、cache/storage 的系统协同。',
    projects: ['FlashMLA', 'DeepGEMM', 'DeepEP', '3FS', 'LMCache'],
    href: '/articles/deepseek-infra-stack-map'
  },
  {
    title: 'Coding Agent',
    summary: 'agent loop、tool system、sandbox、edit/patch、验证和 trajectory。',
    projects: ['Codex', 'Gemini CLI', 'Aider', 'OpenHands', 'SWE-agent'],
    href: '/source-reading/agents/codex'
  }
]

export const validationItems: ValidationItem[] = [
  {
    title: '能跑通',
    summary: 'Transformers、vLLM、SGLang 至少各跑通一次最小推理。',
    href: '/labs/'
  },
  {
    title: '能测量',
    summary: '记录 TTFT、TPOT、tokens/s、显存和启动参数。',
    href: '/systems/benchmark-profiling'
  },
  {
    title: '能画图',
    summary: '画出请求路径、KV cache 生命周期和 scheduler 决策点。',
    href: '/systems/overview'
  },
  {
    title: '能贡献',
    summary: '完成 issue reproduction、docs、benchmark、test 或最小功能 PR。',
    href: '/reference/open-source-playbook'
  }
]
