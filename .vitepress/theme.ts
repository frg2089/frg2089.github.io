import { getThemeConfig } from '@sugarat/theme/node'

import friends from './friends'

// 主题配置
export default getThemeConfig({
  author: '舰队的偶像-岛风酱!',
  article: {
    readingTime: true,
  },
  hotArticle: {
    nextText: '换一组',
    pageSize: 3,
  },
  homeTags: {
    limit: 10,
    sort: 'desc',
    showCount: true,
  },
  home: {
    name: '岛风的船坞',
    motto: '并不常更新的个人博客',
    inspiring:
      '这里是岛风的船坞，这里充满了自然的气息（杂乱、破败且杂草丛生）。',
    pageSize: 10,
  },
  search: false,
  comment: {
    repo: 'frg2089/frg2089.github.io',
    repoId: 'MDEwOlJlcG9zaXRvcnkyNDg0MzQzMTY',
    category: 'Comment',
    categoryId: 'DIC_kwDODs7OjM4CTRvB',
    inputPosition: 'top',
  },
  imagePreview: {
    showProgress: true,
    infinite: true,
    hideOnClickModal: true,
  },
  friend: {
    list: friends,
    limit: 10,
    random: true,
  },
  authorList: [
    {
      nickname: '舰队的偶像-岛风酱!',
      url: 'https://shimakaze.dev',
      des: 'kira~kira!',
    },
  ],
  RSS: {
    title: '岛风的船坞',
    baseUrl: 'https://shimakaze.dev',
    copyright: 'Copyright © 2020-present 舰队的偶像-岛风酱！',
  },
  footer: {
    version: true,
    copyright: {
      message: 'Copyright © 2020 舰队的偶像-岛风酱！',
    },
    icpRecord: {
      name: '萌ICP备20252089号',
      link: 'https://icp.gov.moe/?keyword=20252089',
    },
    message: [
      '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width: 0; display: inline;" src="https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png" /></a>',
      '本作品采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可。',
    ],
  },
  oml2d: {},
  mermaid: true,
  formatShowDate(date) {
    if (typeof date === 'string') {
      date = new Date(date)
    }
    const yyyy = date.getFullYear()
    const MM = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')
    return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`
  },
})
