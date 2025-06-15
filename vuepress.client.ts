import { defineClientConfig } from 'vuepress/client'
import FriendsHome from './src/layouts/FriendsHome.vue'

import 'vuepress-theme-hope/presets/round-blogger-avatar.scss'

export default defineClientConfig({
  layouts: { FriendsHome },
})
