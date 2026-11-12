import { getThemeConfig } from '@sugarat/theme/node'

type ThemeFrientInfo = Extract<
  NonNullable<NonNullable<Parameters<typeof getThemeConfig>[0]>['friend']>,
  any[]
>[0]

export interface FriendInfo extends ThemeFrientInfo {
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
    nickname: 'Dylech30th',
    avatar: 'https://sora.ink/wp-content/uploads/avatar.jpg',
    des: '是DC姐姐',
    url: 'https://sora.ink/',
  },
  {
    nickname: 'MWX',
    avatar: 'https://avatars.githubusercontent.com/u/146726100',
    des: 'MWX!',
    url: 'https://dkrain.com',
  },
  {
    nickname: 'ControlNet',
    avatar: 'https://controlnet.space/images/avatar.jpg',
    des: '永远13岁~',
    url: 'https://controlnet.space/',
  },
  {
    nickname: '扑克',
    avatar: 'https://poker-sang.github.io/imgs/avatar.png',
    des: '太笨了！',
    url: 'https://poker-sang.github.io/',
  },
  {
    nickname: 'AgxCOy',
    avatar: 'https://github.com/AgxCOy.png',
    des: '致敬传奇改名王',
    url: 'https://agxcoy.shimakaze.org/',
  },
  {
    nickname: '红枫',
    avatar: 'https://github.com/HongFengRM.png',
    des: '知名（大概）模组作者',
    url: 'https://github.com/HongFengRM/',
  },
]

export default friends.sort((a, b) => (a.nickname > b.nickname ? 1 : -1))
