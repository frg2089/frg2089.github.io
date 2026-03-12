import { DefaultTheme } from 'vitepress'

const translations: DefaultTheme.AlgoliaSearchOptions['translations'] = {
  button: {
    buttonText: '搜索',
    buttonAriaLabel: '搜索',
  },
  modal: {
    searchBox: {
      // @ts-ignore
      clearButtonTitle: '清除',
      clearButtonAriaLabel: '清除查询',
      closeButtonText: '关闭',
      closeButtonAriaLabel: '关闭',
      placeholderText: '搜索文档或向岛风提问', // fallback: 'Search docs' or 'Search docs or ask AI a question'
      placeholderTextAskAi: '再问岛风一个问题...', // fallback: 'Ask another question...'
      placeholderTextAskAiStreaming: '正在让岛风做！出！回！答！...',
      // 只能是以下值之一
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/enterkeyhint#value
      enterKeyHint: 'search',
      enterKeyHintAskAi: 'enter',
      searchInputLabel: '搜索',
      backToKeywordSearchButtonText: '返回关键词搜索',
      backToKeywordSearchButtonAriaLabel: '返回关键词搜索',
      newConversationPlaceholder: '向岛风提问',
      conversationHistoryTitle: '与岛风的对话历史',
      startNewConversationText: '开始新对话',
      viewConversationHistoryText: '对话历史',
    },
    startScreen: {
      recentSearchesTitle: '最近搜索',
      noRecentSearchesText: '无最近搜索',
      saveRecentSearchButtonTitle: '保存此搜索',
      removeRecentSearchButtonTitle: '从历史记录中移除此搜索',
      favoriteSearchesTitle: '收藏',
      removeFavoriteSearchButtonTitle: '从收藏中移除此搜索',
      // @ts-ignore
      recentConversationsTitle: '最近与岛风的对话',
      removeRecentConversationButtonTitle: '从历史记录中移除此对话',
    },
    errorScreen: {
      titleText: '无法获取结果',
      helpText: '无法与 Algolia 连接',
    },
    noResultsScreen: {
      noResultsText: '未找到关于',
      suggestedQueryText: '尝试搜索',
      reportMissingResultsText: '认为此查询应该返回结果？',
      reportMissingResultsLinkText: '告诉我们。',
    },
    resultsScreen: {
      askAiPlaceholder: '向岛风提问：',
      noResultsAskAiPlaceholder: '在文档中没找到？让岛风来帮忙：',
    },
    askAiScreen: {
      disclaimerText: '答案由 AI 生成，可能会出错。请核实回复内容。',
      relatedSourcesText: '相关来源',
      thinkingText: '岛风正在思考...',
      copyButtonText: '复制',
      copyButtonCopiedText: '已复制！',
      copyButtonTitle: '复制',
      likeButtonTitle: '赞同',
      dislikeButtonTitle: '反对',
      thanksForFeedbackText: '感谢您的反馈！',
      preToolCallText: '岛风正在搜索...',
      duringToolCallText: '岛风正在搜索 ',
      afterToolCallText: '岛风已搜索',
      // 如果提供，这些将覆盖聚合工具调用的默认渲染：
      aggregatedToolCallNode: undefined, // (queries: string[], onSearchQueryClick: (query: string) => void) => React.ReactNode
      aggregatedToolCallText: undefined, // (queries: string[]) => { before?: string; separator?: string; lastSeparator?: string; after?: string }
      // 用户停止流式传输消息时显示的文本
      stoppedStreamingText: '您叫住了岛风',
    },
    footer: {
      selectText: '选择',
      // @ts-ignore
      submitQuestionText: '提交问题',
      selectKeyAriaLabel: '回车键',
      navigateText: '导航',
      navigateUpKeyAriaLabel: '向上箭头',
      navigateDownKeyAriaLabel: '向下箭头',
      closeText: '关闭',
      backToSearchText: '返回搜索',
      closeKeyAriaLabel: 'Esc 键',
      poweredByText: '技术支持',
    },
    newConversation: {
      newConversationTitle: '今天岛风能帮您什么？',
      newConversationDescription:
        '岛风会搜索您的文档，帮助您快速找到设置指南、功能详情和故障排除技巧。',
    },
  },
}

const options: DefaultTheme.AlgoliaSearchOptions = {
  appId: 'L43QG2V2U8',
  apiKey: 'bb9041ad518048e7d6a9974f39d7bcb8',
  indexName: 'shimakaze',
  // @ts-ignore
  askAi: {
    indexName: 'shimakaze-markdown',
    assistantId: 'GxqX8NzLrReM',
  },
  translations,
}

export default options
