import { ThemeBlogHomeProjectOptions } from 'vuepress-theme-hope'

const friends: ThemeBlogHomeProjectOptions[] = [
  {
    name: "Dylech30th's Blog",
    icon: 'https://sora.ink/wp-content/uploads/2023/12/6aba06f93d5e08829cd4bb19c0782349fced359f.jpg@120w_120h_1c.png',
    desc: '是DC姐姐',
    link: 'https://sora.ink/',
  },
  {
    name: 'MWXの花田',
    icon: 'https://dkrain.com/assets/img/auther.jpg',
    desc: 'MWX!',
    link: 'https://dkrain.com',
  },
  {
    name: 'ControlNet Blog',
    icon: 'https://controlnet.space/images/avatar.jpg',
    desc: '永远13岁~',
    link: 'https://controlnet.space/',
  },
  {
    name: '扑克博客',
    icon: 'https://poker-sang.github.io/img/avatar.png',
    desc: '太笨了！',
    link: 'https://poker-sang.github.io/',
  },
  {
    name: 'ChlorideP（氯喵）',
    icon: 'https://chloridep.github.io/assets/images/beibei.webp',
    desc: '「有点追求，但不多。」',
    link: 'https://chloridep.github.io/',
  },
].sort((a, b) => (a.name > b.name ? 1 : -1))
export default friends
