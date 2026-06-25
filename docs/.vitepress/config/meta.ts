import type { UserConfig } from 'vitepress'

export const meta: UserConfig = {
  title: 'LLM 推理基础设施入门',
  description: '以 CUDA 为核心的 LLM 推理基础设施学习路线',
  lang: 'zh-CN',
  base: process.env.VITEPRESS_BASE ?? '/',
  cleanUrls: true,
  lastUpdated: true
}
