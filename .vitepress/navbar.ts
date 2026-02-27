import { DefaultTheme } from 'vitepress'

export default [
  { text: '首页', link: '/' },
  { text: '友情链接', link: '/friends/' },
  { text: '归档', link: '/article/' },
  { text: '分类', link: '/category/' },
  { text: '星标', link: '/star/' },
  { text: '标签', link: '/tag/' },
  { text: '时间线', link: '/timeline/' },
] satisfies DefaultTheme.NavItem[]
