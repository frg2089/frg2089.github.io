declare module 'vuepress-theme-hope' {
  export interface FriendLink {
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
