import Theme from '@sugarat/theme'
import type { Theme as ThemeConfig } from 'vitepress'

import App from './App.vue'

export default {
  Layout: App,
  extends: Theme,
  enhanceApp: ({ app }) => {},
} satisfies ThemeConfig
