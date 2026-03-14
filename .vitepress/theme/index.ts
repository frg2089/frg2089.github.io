import { Theme } from 'vitepress'
import { initComponent } from 'vitepress-plugin-legend/component'
import Teek from 'vitepress-theme-teek'
import App from './App.vue'

import 'vitepress-theme-teek/index.css'

export default {
  Layout: App,
  extends: Teek,
  enhanceApp: ({ app }) => {
    initComponent(app)
  },
} satisfies Theme
