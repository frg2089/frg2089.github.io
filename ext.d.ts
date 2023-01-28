import { BlogLocaleConfig, BlogLocaleOptions } from 'vuepress-theme-hope'

declare module 'vuepress-theme-hope' {
  export type FriendLink = {
    name: string
    logo: string
    desc: string
    link: string
  }
  export interface BlogLocaleOptions {
    friends: FriendLink[]
  }
  export interface BlogLocaleConfig {
    friends: FriendLink[]
  }
}

export { }