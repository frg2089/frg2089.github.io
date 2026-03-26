import { vitepressPluginLegend } from 'vitepress-plugin-legend'
import { defineTeekConfig } from 'vitepress-theme-teek/config'
import footer from './footer'
import friends from './friends'

// Teek 主题配置
export default defineTeekConfig({
  homeCardListPosition: 'right',
  pageStyle: 'default',
  loading: '正在拔锚...',
  backTop: {
    content: 'icon',
  },
  sidebarTrigger: true,
  bodyBgImg: {},
  author: {
    name: '舰队的偶像-岛风酱!',
    link: 'https://blog.shimakaze.dev',
  },
  banner: {
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
  wallpaper: {
    enabled: true,
    hideBanner: true,
    hideMask: true,
  },
  post: {
    postStyle: 'list',
    showCapture: true,
  },
  blogger: {
    name: '舰队的偶像-岛风酱!',
    slogan: '喔~',
    avatar: '/avatar.webp',
    shape: 'circle-rotate',
    status: {
      icon: '✨',
      size: 24,
      title: 'kira~kira~',
    },
  },
  friendLink: {
    enabled: true,
    list: friends,
    title: '岛风的朋友们',
  },
  docAnalysis: {
    createTime: 'Sun Jun 14 2020 21:18:22',
  },
  social: [
    { icon: 'mdi:email', name: 'Email', link: 'mailto:i@shimakaze.dev' },
    {
      icon: 'mdi:github',
      name: 'GitHub',
      link: 'https://github.com/frg2089',
    },
    { icon: 'mdi:rss', name: 'Feed', link: '/feed.rss' },
  ],
  footerGroup: footer,
  footerInfo: {
    bottomMessage: [
      '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png" /></a>',
      '本作品采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可。',
    ],
    copyright: {
      createYear: '2020',
      suffix: '舰队的偶像-岛风酱!',
    },
    icpRecord: {
      name: '萌ICP备20252089号',
      link: 'https://icp.gov.moe/?keyword=20252089',
    },
  },
  articleAnalyze: {
    dateFormat: 'yyyy-MM-dd hh:mm:ss',
    showUpdateDate: true,
    showTag: true,
  },
  articleShare: {
    enabled: true,
  },
  riskLink: {
    enabled: true,
    whitelist: ['https://learn.microsoft.com', 'https://github.com/frg2089/'],
  },
  breadcrumb: {
    showCurrentName: true,
    separator: '>',
  },
  comment: {
    provider: 'giscus',
    options: {
      repo: 'frg2089/frg2089.github.io',
      repoId: 'MDEwOlJlcG9zaXRvcnkyNDg0MzQzMTY',
      category: 'Comment',
      categoryId: 'DIC_kwDODs7OjM4CTRvB',
    },
  },

  vitePlugins: {
    sidebarOption: {
      titleFormMd: true,
      ignoreIndexMd: true,
      collapsed: true,
    },
    catalogueOption: {
      titleFormMd: true,
      ignoreIndexMd: true,
    },
    autoFrontmatterOption: {
      permalink: false,
    },
  },

  markdown: {
    config: async md => {
      vitepressPluginLegend(md)
    },
  },

  siteAnalytics: [],
})
