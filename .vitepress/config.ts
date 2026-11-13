import * as child_process from 'node:child_process'
import * as path from 'node:path'
import * as url from 'node:url'
import * as util from 'node:util'

import { defineConfig } from '@sugarat/theme/node'
import MDItFootnote from 'markdown-it-footnote'

import algolia from './algolia'
import しまかぜのともだち, { しまかぜ } from './friends'
import head from './head'
import nav from './navbar'
import sidebar from './sidebar'
import theme from './theme'

const holidayCalendar: Record<number, any> = {}
try {
  const { default: HolidayGlobal } = await import(
    'holiday-calendar/data/index.json',
    { with: { type: 'json' } }
  )
  const cn = HolidayGlobal.regions.find(i => i.name === 'CN')
  if (!cn) throw '假日数据不可用'
  if (cn.endYear < new Date().getFullYear()) console.warn('假日数据未更新')
  for (let year = cn.startYear; year <= cn.endYear; year++) {
    const data = await import(`holiday-calendar/data/CN/${year}.json`, {
      with: { type: 'json' },
    })
    holidayCalendar[year] = data.default
  }
} catch (error) {
  if (error instanceof Error) {
    console.warn(`未能成功加载调休数据\r\n    ${error.message}`)
  } else {
    console.warn(`未能成功加载调休数据\r\n    ${error}`)
  }
}

const themeDir = path.dirname(
  url.fileURLToPath(import.meta.resolve('@sugarat/theme')),
)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: theme,
  srcDir: 'docs',
  outDir: 'dist',
  cacheDir: '.cache',

  title: '岛风的船坞',
  description: '这里是岛风的个人博客网站',
  lang: 'zh-CN',

  head,

  markdown: {
    anchor: {
      level: [1, 2, 3, 4],
    },
    lineNumbers: true,
    image: {
      lazyLoading: true,
    },
    config: md => {
      md.use(MDItFootnote)
    },
  },

  // https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    logo: '/favicon.svg',

    nav,

    // sidebar,

    search: {
      provider: 'algolia',
      options: algolia as any,
    },

    lastUpdated: {
      text: '最后更新时间',
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/frg2089',
        ariaLabel: 'GitHub',
      },
      {
        icon: {
          svg: [
            '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">',
            '	<path d="M0 0h24v24H0z" fill="none" />',
            '	<path fill="currentColor" d="m20 8l-8 5l-8-5V6l8 5l8-5m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2" />',
            '</svg>',
          ].join(''),
        },
        link: 'mailto:i@shimakaze.dev',
        ariaLabel: '发送邮件',
      },
    ],

    editLink: {
      pattern:
        'https://github.com/frg2089/frg2089.github.io/edit/master/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
  },

  sitemap: {
    hostname: 'https://shimakaze.dev',
  },

  vite: {
    define: {
      __HOLIDAY__: holidayCalendar,
      しまかぜのともだち,
      しまかぜ,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    resolve: {
      alias: [
        {
          find: /^@sugarat\/theme\/components\/(\w+?)\.vue$/,
          replacement: path.resolve(themeDir, 'components/$1.vue'),
        },
        {
          find: /^.*\/BlogHomeInfo\.vue$/,
          replacement: path.resolve(
            import.meta.dirname,
            'theme/components/BlogHomeInfo.vue',
          ),
        },
      ],
    },
  },
})
