import { defineConfig } from 'vitepress'
import { meta } from './config/meta'
import { nav } from './config/nav'
import { sidebar } from './config/sidebar'
import { nav as navEn } from './theme/data/nav-en'
import { sidebarEn } from './theme/data/sidebar-en'

export default defineConfig({
  ...meta,
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN'
    },
    en: {
      label: 'English',
      lang: 'en',
      title: 'LLM Infra Basic',
      description: 'CUDA-first LLM inference infrastructure learning path',
      themeConfig: {
        nav: navEn,
        sidebar: sidebarEn,
        outline: {
          label: 'On this page'
        },
        lastUpdated: {
          text: 'Last updated'
        },
        docFooter: {
          prev: 'Previous',
          next: 'Next'
        },
        returnToTopLabel: 'Return to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Appearance',
        lightModeSwitchTitle: 'Switch to light mode',
        darkModeSwitchTitle: 'Switch to dark mode'
      }
    }
  },
  themeConfig: {
    logo: { text: 'LLM Infra' },
    nav,
    sidebar,
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/OpenCQUT/infra-basic' }
    ]
  }
})
