import { defineConfig } from 'vitepress'
import friends from './friends'
import head from './head'
import nav from './navbar'
import sidebar from './sidebar'
import teekConfig from './theme'

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

  vite: {
    define: {
      __HOLIDAY__: holidayCalendar,
      しまかぜのともだち: friends,
    },
  },
})
