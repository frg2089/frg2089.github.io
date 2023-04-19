import { sidebar } from 'vuepress-theme-hope'

export default sidebar({
  '/': [
    '',
    {
      text: '文章',
      icon: 'note',
      prefix: 'posts/',
      children: 'structure'
    }
  ]
})
