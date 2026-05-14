import { FriendLinkItem } from 'vitepress-theme-teek'

export interface FriendInfo extends FriendLinkItem {
  background?: string
  special?: {
    characterArtUrl: string
    leftBackgroundImageUrl: string
    rightBackgroundImageUrl: string
    shadowColor: string
    deg: number
  }
}

const friends: FriendInfo[] = [
  {
    name: 'Dylech30th',
    avatar: 'https://sora.ink/wp-content/uploads/avatar.jpg',
    desc: '是DC姐姐',
    link: 'https://sora.ink/',
  },
  {
    name: 'MWX',
    avatar: 'https://avatars.githubusercontent.com/u/146726100',
    desc: 'MWX!',
    link: 'https://dkrain.com',
  },
  {
    name: 'ControlNet',
    avatar: 'https://controlnet.space/images/avatar.jpg',
    desc: '永远13岁~',
    link: 'https://controlnet.space/',
  },
  {
    name: '扑克',
    avatar: 'https://poker-sang.github.io/imgs/avatar.png',
    desc: '太笨了！',
    link: 'https://poker-sang.github.io/',
  },
  {
    name: 'AgxCOy',
    avatar: 'https://github.com/AgxCOy.png',
    desc: '致敬传奇改名王',
    link: 'https://agxcoy.shimakaze.org/',
  },
  {
    name: '红枫',
    avatar: 'https://github.com/HongFengRM.png',
    desc: '知名（大概）模组作者',
    link: 'https://github.com/HongFengRM/',
  },
]

export default friends.sort((a, b) => (a.name > b.name ? 1 : -1))
