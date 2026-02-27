import { defineConfig } from 'vitepress'
import head from './head'
import nav from './navbar'
import sidebar from './sidebar'
import teekConfig from './theme'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: teekConfig,
  srcDir: 'docs',
  outDir: 'dist',
  cacheDir: '.cache',

  title: '岛风的船坞',
  description: '这里是岛风的个人博客网站',

  head,
  // https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    logo: 'avatar.webp',

    nav,

    sidebar,

    search: {
      provider: 'algolia',
      options: {
        appId: 'L43QG2V2U8',
        apiKey: 'bb9041ad518048e7d6a9974f39d7bcb8',
        indexName: 'shimakaze',
      },
    },

    lastUpdated: {
      text: '最后更新时间',
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/frg2089',
      },
    ],

    editLink: {
      pattern:
        'https://github.com/frg2089/frg2089.github.io/edit/master/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
  },
  sitemap: {
    hostname: 'https://blog.shimakaze.dev',
  },
})
