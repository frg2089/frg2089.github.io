import { sidebar } from 'vuepress-theme-hope'

export default sidebar({
  '/': [
    '',
    {
      text: '文章',
      icon: 'file-lines',
      prefix: 'posts/',
      children: 'structure',
    },
  ],
})
