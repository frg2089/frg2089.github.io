import { Theme } from 'vitepress'
import Teek from 'vitepress-theme-teek'
import 'vitepress-theme-teek/index.css'
import App from './App.vue'

export default {
  Layout: App,
  extends: Teek,
} satisfies Theme
