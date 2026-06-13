import type { UserConfig } from 'vitepress'

export const meta: UserConfig = {
  title: 'LLM Infra Basic',
  description: 'CUDA-first LLM inference infrastructure learning path',
  lang: 'zh-CN',
  base: process.env.VITEPRESS_BASE ?? '/',
  cleanUrls: true,
  lastUpdated: true
}
