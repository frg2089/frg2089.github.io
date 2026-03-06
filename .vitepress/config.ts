import * as child_process from 'node:child_process'
import * as path from 'node:path'
import * as util from 'node:util'
import { defineConfig } from 'vitepress'
import friends from './friends'
import head from './head'
import nav from './navbar'
import sidebar from './sidebar'
import teekConfig from './theme'

const exec = util.promisify(child_process.exec)

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

  async transformPageData(pageData, ctx) {
    if (!pageData.frontmatter['date']) {
      const fullPath = path.resolve(ctx.siteConfig.srcDir, pageData.filePath)

      const process = await exec(
        `git log --reverse -1 --pretty="%ai" "${fullPath}"`,
      )

      const date = new Date(process.stdout)

      // Note: 需要对时间进行修补才能使创建时间和 VitePress@1.6.4 更新时间一致
      // VitePress 获取更新时间的逻辑是
      // > git log -1 --pretty="%ai" a.md
      // 2025-03-24 00:54:19 +0800
      // 在页面上显示的更新时间是
      // <a title="更新时间" class="hover-color" aria-label="2025-03-24 00:54:19">2025-03-24 00:54:19</a>
      // 但如果直接将最早提交时间写入 pageData.frontmatter.date
      // 其结果是不准确的
      // > git log --reverse -1 --pretty="%ai" a.md
      // 2025-03-24 00:54:19 +0800
      // 页面上却是
      // <a title="创建时间" class="hover-color" aria-label="2025-03-23 16:54:19">2025-03-23 16:54:19</a>
      // 所以此处需要修补时区偏移使其与 VitePress 行为一致
      const patchDate = date.getTime() - date.getTimezoneOffset() * 60000

      pageData.frontmatter['date'] = patchDate
    }

    await teekConfig.transformPageData?.(pageData, ctx)
  },
  vite: {
    define: {
      __HOLIDAY__: holidayCalendar,
      しまかぜのともだち: friends,
    },
  },
})
