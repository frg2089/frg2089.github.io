import { hopeTheme } from 'vuepress-theme-hope'
import navbar from './vuepress.navbar'
import sidebar from './vuepress.sidebar'

export default hopeTheme(
  {
    hostname: 'https://blog.shimakaze.dev',

    author: {
      name: '舰队的偶像-岛风酱!',
      url: 'https://blog.shimakaze.dev',
    },

    iconAssets: 'iconify',

    logo: 'https://gravatar.loli.net/avatar/8aa3a373ab407b250e866cc7ed5deea8?s=400',

    repo: 'frg2089/frg2089.github.io',

    docsDir: 'docs',

    docsBranch: 'master',

    pageInfo: [
      'Author',
      'Date',
      'Original',
      'Category',
      'Tag',
      'ReadingTime',
      'Word',
    ],

    // navbar
    navbar,

    // sidebar
    sidebar,

    displayFooter: true,

    footer:
      '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png" /></a><br />本作品采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可。',

    markdown: {
      gfm: true,
      hint: true,
      alert: true,
      align: true,
      attrs: true,
      sup: true,
      sub: true,
      footnote: true,
      mark: true,
      tasklist: true,
      component: true,
      mermaid: true,
      spoiler: true,
      breaks: true,
      tabs: true,
      codeTabs: true,
      figure: true,
      highlighter: {
        type: 'shiki',
        lineNumbers: true,
        removeLastLine: true,
        preWrapper: true,
        collapsedLines: true,
        themes: {
          light: 'light-plus',
          dark: 'dark-plus',
        },
        notationDiff: true,
        notationFocus: true,
        notationHighlight: true,
        notationErrorLevel: true,
        notationWordHighlight: true,
        whitespace: true,
      },
      imgLazyload: true,
      imgMark: true,
      imgSize: true,
      obsidianImgSize: true,
      include: true,
      linkify: true,
      linksCheck: true,
    },

    // page meta
    metaLocales: {
      editLink: '在 GitHub 上编辑此页',
    },

    blogLocales: {
      friends: '友链',
    },

    blog: {
      description: '咱又来丢人啦!~',

      intro: 'https://github.com/frg2089',

      medias: {
        Email: 'mailto:i@shimakaze.dev',
        GitHub: 'https://github.com/frg2089',
        Rss: '/rss.xml',
      },
    },

    plugins: {
      blog: true,

      docsearch: {
        appId: 'L43QG2V2U8',
        apiKey: '82d617ee1fa8605102743b15f144d589',
        indexName: 'shimakaze',
      },

      git: {
        createdTime: true,
        updatedTime: true,
        contributors: true,
        transformContributors: contributors =>
          Object.values(
            contributors.reduce(
              (a, b) => {
                a[b.email] = b
                return a
              },
              {} as Record<string, (typeof contributors)[0]>,
            ),
          ),
      },

      copyCode: {},

      copyright: {
        global: true,
        license: 'CC-BY-NC-SA 4.0',
      },

      comment: {
        provider: 'Giscus',
        repo: 'frg2089/frg2089.github.io',
        repoId: 'MDEwOlJlcG9zaXRvcnkyNDg0MzQzMTY',
        category: 'Comment',
        categoryId: 'DIC_kwDODs7OjM4CTRvB',
      },

      feed: {
        atom: true,
        json: true,
        rss: true,
      },

      components: {
        components: [
          // 'ArtPlayer',
          'Badge',
          'BiliBili',
          // 'CodePen',
          'FontIcon',
          'PDF',
          'Share',
          // 'StackBlitz',
          'SiteInfo',
          'VPBanner',
          'VPCard',
          // 'VidStack',
          // 'XiGua',
        ],
      },
      // uncomment these if you want a PWA
      pwa: {
        favicon: '/favicon.ico',
        cacheHTML: true,
        cacheImage: true,
        appendBase: true,
        themeColor: '#744da9',
        apple: {
          icon: '/assets/icon/apple-icon-152.png',
          statusBarColor: 'black',
        },
        manifest: {
          icons: [
            {
              src: '/assets/icon/chrome-mask-512.png',
              sizes: '512x512',
              purpose: 'maskable',
              type: 'image/png',
            },
            {
              src: '/assets/icon/chrome-mask-192.png',
              sizes: '192x192',
              purpose: 'maskable',
              type: 'image/png',
            },
            {
              src: '/assets/icon/chrome-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/assets/icon/chrome-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
          ],
        },
      },

      sitemap: {
        changefreq: 'weekly',
      },
    },
  },
  {
    custom: true,
  },
)
