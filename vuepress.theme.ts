import { hopeTheme } from 'vuepress-theme-hope'
import navbar from './vuepress.navbar'
import sidebar from './vuepress.sidebar'

export default hopeTheme({
  hostname: 'https://frg2089.github.io',

  author: {
    name: '舰队的偶像-岛风酱!',
    url: 'https://frg2089.github.io'
  },

  iconAssets: 'iconfont',

  logo: 'https://cravatar.cn/avatar/8aa3a373ab407b250e866cc7ed5deea8?s=400',

  repo: 'frg2089/frg2089.github.io',

  docsDir: 'docs',

  docsBranch: 'master',

  pageInfo: ['Author', 'Date', 'Original', 'Category', 'Tag', 'ReadingTime', 'Word'],

  // navbar
  navbar,

  // sidebar
  sidebar,

  displayFooter: true,

  footer: '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png" /></a><br />本作品采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可。',

  // page meta
  metaLocales: {
    editLink: '在 GitHub 上编辑此页'
  },

  blogLocales: {
    friends: '友链'
  },

  blog: {
    description: '咱又来丢人啦!~',

    intro: 'https://github.com/frg2089',

    roundAvatar: true,

    medias: {
      Email: 'mailto:frg2089@outlook.com',
      GitHub: 'https://github.com/frg2089',
      Rss: '/rss.xml'
    }
  },

  plugins: {
    blog: true,

    copyCode: {},

    copyright: {
      global: true,
      license: 'CC-BY-NC-SA 4.0'
    },

    prismjs: {
      light: 'vs',
      dark: 'vsc-dark-plus'
    },

    comment: {
      provider: 'Giscus',
      repo: 'frg2089/frg2089.github.io',
      repoId: 'MDEwOlJlcG9zaXRvcnkyNDg0MzQzMTY',
      category: 'Comment',
      categoryId: 'DIC_kwDODs7OjM4CTRvB'
    },

    feed: {
      atom: true,
      json: true,
      rss: true
    },

    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      container: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ['ts', 'vue']
      },
      presentation: {
        plugins: ['highlight', 'math', 'search', 'notes', 'zoom']
      },
      stylize: [
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true
    },

    // uncomment these if you want a PWA
    pwa: {
      favicon: '/favicon.ico',
      cacheHTML: true,
      cachePic: true,
      appendBase: true,
      themeColor: '#744da9',
      apple: {
        icon: '/assets/icon/apple-icon-152.png',
        statusBarColor: 'black'
      },
      msTile: {
        image: '/assets/icon/ms-icon-144.png',
        color: '#ffffff'
      },
      manifest: {
        icons: [
          {
            src: '/assets/icon/chrome-mask-512.png',
            sizes: '512x512',
            purpose: 'maskable',
            type: 'image/png'
          },
          {
            src: '/assets/icon/chrome-mask-192.png',
            sizes: '192x192',
            purpose: 'maskable',
            type: 'image/png'
          },
          {
            src: '/assets/icon/chrome-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/assets/icon/chrome-192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    }
  }
},{
  custom: true
})
