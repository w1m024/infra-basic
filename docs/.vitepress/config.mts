import { defineConfig } from 'vitepress'
import { meta } from './config/meta'
import { nav } from './config/nav'
import { sidebar } from './config/sidebar'

export default defineConfig({
  ...meta,
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
