import { defineTeekConfig } from 'vitepress-theme-teek/config'
import nav from './navbar'
import sidebar from './sidebar'

// Teek 主题配置
export default defineTeekConfig({
  teekTheme: true,

  teekHome: true,

  author: {
    name: '舰队的偶像-岛风酱!',
    link: 'https://blog.shimakaze.dev',
  },

  banner: {
    enabled: true,
    bgStyle: 'fullImg',
    imgSrc: [
      // using public anime wallpaper API
      'https://www.loliapi.com/acg/',
    ],
    imgInterval: 15 * 1000,
    imgShuffle: true,
    imgWaves: true,
    mask: true,
    maskBg: 'rgba(0, 0, 0, 0.5)',
    descStyle: 'types',
    description:
      '这里是岛风的船坞，这里充满了自然的气息（杂乱、破败且杂草丛生）。',
  },

  homeCardListPosition: 'right',
  homeCardSort: ['topArticle', 'category', 'tag', 'friendLink', 'docAnalysis'],
  blogger: {
    name: '舰队的偶像-岛风酱!',
    avatar: '/avatar.webp',
    shape: 'circle',
    status: {
      icon: '🌟',
      size: 24,
    },
  },

  comment: {
    provider: 'giscus',
    repo: 'frg2089/frg2089.github.io',
    repoId: 'MDEwOlJlcG9zaXRvcnkyNDg0MzQzMTY',
    category: 'Comment',
    categoryId: 'DIC_kwDODs7OjM4CTRvB',
  },

  social: [
    { icon: 'mdi:email', name: 'Email', link: 'mailto:i@shimakaze.dev' },
    {
      icon: 'mdi:github',
      name: 'GitHub',
      link: 'https://github.com/frg2089',
    },
    { icon: 'mdi:rss', name: 'Feed', link: '/rss.xml' },
  ],

  // https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    nav,

    sidebar,
  },
})
