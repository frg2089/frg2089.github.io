import { ThemeBlogHomeProjectOptions } from 'vuepress-theme-hope'

const friends: ThemeBlogHomeProjectOptions[] = [
  {
    name: "Dylech30th's Blog",
    icon: 'https://sora.ink/wp-content/uploads/avatar.jpg',
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
    icon: 'https://poker-sang.github.io/imgs/avatar.png',
    desc: '太笨了！',
    link: 'https://poker-sang.github.io/',
  },
  {
    name: 'AgxCOy',
    icon: 'https://agxcoy.shimakaze.org/assets/images/avatar.webp',
    desc: '致敬传奇改名王',
    link: 'https://agxcoy.shimakaze.org/',
  },
  {
    name: '红枫',
    icon: 'https://rm.shimakaze.org/MapleLeaf.webp',
    desc: '知名（大概）模组作者',
    link: 'https://rm.shimakaze.org/',
  },
].sort((a, b) => (a.name > b.name ? 1 : -1))
export default friends
