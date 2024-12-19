import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { getDirname, path } from 'vuepress/utils'
import friends from './vuepress.friends'
import head from './vuepress.head'
import theme from './vuepress.theme'

const dirname = getDirname(import.meta.url)

const component = (component: string) =>
  path.resolve(dirname, 'src', 'components', component)

export default defineUserConfig({
  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {},
  }),

  base: '/',
  head,

  locales: {
    '/': {
      lang: 'zh-CN',
      title: '岛风的港区',
      description: '这里是岛风的个人博客网站',
    },
  },

  temp: '.temp',
  cache: '.cache',
  public: 'public',
  dest: 'dist',

  theme,

  shouldPrefetch: false,

  alias: {
    '@theme-hope/components/MarkdownContent': component('MarkdownContent.vue'),
  },

  define: {
    しまかぜのともだち: friends,
  },
})
