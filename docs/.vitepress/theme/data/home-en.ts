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
  { text: 'Getting Started', href: '/en/start/' },
  { text: 'Source Reading Map', href: '/en/source-reading/' },
  { text: 'One Month Plan', href: '/en/start/one-month-plan' }
]

export const startSteps: StartStep[] = [
  {
    id: '01',
    title: 'Environment & PyTorch CUDA',
    summary: 'Confirm NVIDIA CUDA path, PyTorch tensor, dtype, memory, and profiler basics.',
    output: 'A minimal inference and profiler record.',
    href: '/en/start/environment'
  },
  {
    id: '02',
    title: 'Operator / Kernel',
    summary: 'Understand Python calls, operator dispatch, Triton/CUDA kernel, and performance bottleneck boundaries.',
    output: 'An operator-to-kernel path diagram.',
    href: '/en/labs/p1-operator-kernel'
  },
  {
    id: '03',
    title: 'Inference System Mainline',
    summary: 'Connect prefill/decode, KV cache, scheduler, streaming, and benchmark metrics.',
    output: 'A main flow diagram from API request to token output.',
    href: '/en/systems/'
  },
  {
    id: '04',
    title: 'vLLM / SGLang Source',
    summary: 'Read serving engines by entry point, state, loop, and resource management - not just README.',
    output: 'Two source reading maps and one minimal experiment.',
    href: '/en/source-reading/'
  },
  {
    id: '05',
    title: 'Lab & PR',
    summary: 'Enter open source contribution loop via benchmark, bug reproduction, docs, or tests.',
    output: 'A reproducible issue, benchmark, or minimal PR.',
    href: '/en/labs/p9-first-pr'
  }
]

export const sourceTracks: SourceTrack[] = [
  {
    title: 'Serving Engines',
    summary: 'Request entry, scheduling, KV cache, worker, model execution, and streaming.',
    projects: ['vLLM', 'SGLang', 'TGI', 'LMDeploy', 'TensorRT-LLM'],
    href: '/en/source-reading/'
  },
  {
    title: 'Kernel Libraries',
    summary: 'Attention, GEMM, Triton/CUDA/CUTLASS abstractions and serving backend connections.',
    projects: ['FlashInfer', 'FlashAttention', 'CUTLASS', 'Triton', 'DeepGEMM'],
    href: '/en/source-reading/'
  },
  {
    title: 'DeepSeek / MoE',
    summary: 'MLA, FP8 GEMM, expert parallel communication, cache/storage system collaboration.',
    projects: ['FlashMLA', 'DeepGEMM', 'DeepEP', '3FS', 'LMCache'],
    href: '/en/articles/deepseek-infra-stack-map'
  },
  {
    title: 'Coding Agents',
    summary: 'Agent loop, tool system, sandbox, edit/patch, verification, and trajectory.',
    projects: ['Codex', 'Gemini CLI', 'Aider', 'OpenHands', 'SWE-agent'],
    href: '/en/source-reading/'
  }
]

export const validationItems: ValidationItem[] = [
  {
    title: 'Run It',
    summary: 'Run at least one minimal inference with Transformers, vLLM, and SGLang each.',
    href: '/en/labs/'
  },
  {
    title: 'Measure It',
    summary: 'Record TTFT, TPOT, tokens/s, memory, and launch parameters.',
    href: '/en/systems/benchmark-profiling'
  },
  {
    title: 'Draw It',
    summary: 'Draw request path, KV cache lifecycle, and scheduler decision points.',
    href: '/en/systems/overview'
  },
  {
    title: 'Contribute It',
    summary: 'Complete issue reproduction, docs, benchmark, test, or minimal feature PR.',
    href: '/en/reference/open-source-playbook'
  }
]
