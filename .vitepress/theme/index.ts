import Theme from '@sugarat/theme'
import { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus'
import type { Theme as ThemeConfig } from 'vitepress'

import App from './App.vue'

export default {
  Layout: App,
  extends: Theme,
  enhanceApp: ({ app }) => {
    // 固定 ID / z-index 序列，保证 SSR 与客户端水合结果一致
    app.provide(ID_INJECTION_KEY, { prefix: 1024, current: 0 })
    app.provide(ZINDEX_INJECTION_KEY, { current: 0 })
  },
} satisfies ThemeConfig
