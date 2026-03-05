import { Theme } from 'vitepress'
import Teek from 'vitepress-theme-teek'
import 'vitepress-theme-teek/index.css'
import { h } from 'vue'
import CalendarCard from './components/CalendarCard.vue'

export default {
  extends: Teek,
  Layout: () =>
    h(Teek.Layout, null, {
      'teek-home-card-my-after': () => h(CalendarCard),
    }),
} satisfies Theme
