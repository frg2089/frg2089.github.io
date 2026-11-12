import type { DefaultTheme } from 'vitepress/theme'

type DocSearchProps = DefaultTheme.AlgoliaSearchOptions

const options: DocSearchProps = {
  appId: 'L43QG2V2U8',
  apiKey: '305cc25b9087e61962fc25566fa04469',
  indexName: 'shimakaze',
  translations: {
    button: {
      buttonText: '搜索',
      buttonAriaLabel: '搜索',
    },
    modal: {
      errorScreen: {
        titleText: '无法获取结果',
        helpText: '无法与 Algolia 连接',
      },
      startScreen: {
        recentSearchesTitle: '最近搜索',
        noRecentSearchesText: '无最近搜索',
        saveRecentSearchButtonTitle: '保存此搜索',
        removeRecentSearchButtonTitle: '从历史记录中移除此搜索',
        favoriteSearchesTitle: '收藏',
        removeFavoriteSearchButtonTitle: '从收藏中移除此搜索',
      },
      noResultsScreen: {
        noResultsText: '未找到有关于',
        suggestedQueryText: '尝试搜索',
        reportMissingResultsText: '认为此查询应该返回结果？',
        reportMissingResultsLinkText: '告诉我们。',
      },
      searchBox: {
        resetButtonTitle: '清除',
        resetButtonAriaLabel: '清除查询',
        cancelButtonText: '关闭',
        cancelButtonAriaLabel: '关闭搜索窗口',
      },
      footer: {
        selectText: '选择',
        selectKeyAriaLabel: '回车键',
        navigateText: '导航',
        navigateUpKeyAriaLabel: '向上箭头',
        navigateDownKeyAriaLabel: '向下箭头',
        closeText: '关闭',
        closeKeyAriaLabel: 'Esc 键',
        searchByText: '技术支持',
      },
    },
  },
}

export default options
