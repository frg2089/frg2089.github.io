import { getThemeConfig } from '@sugarat/theme/node'

type ThemeFrientInfo = Extract<
  NonNullable<NonNullable<Parameters<typeof getThemeConfig>[0]>['friend']>,
  any[]
>[0]

/**
 * @description 好友信息
 */
interface FriendLink {
  /**
   * @description 昵称
   */
  nickname: string
  /**
   * @description 个人简介
   */
  des: string
  /**
   * @description 个人主页 URL
   */
  url: string
  /**
   * @description 头像 URL 或对象
   */
  avatar:
    | string
    | {
        /**
         * @description 头像 URL
         */
        src: string
        /**
         * @description 头像描述
         */
        alt?: string
      }
    | {
        /**
         * @description 亮色模式下的头像 URL
         */
        light: string
        /**
         * @description 暗色模式下的头像 URL
         */
        dark: string
        /**
         * @description 头像描述
         */
        alt?: string
      }
}

/**
 * @description 超级好友信息
 */
export interface FriendInfo extends ThemeFrientInfo {
  /**
   * @description 背景图片 URL
   *
   * @default avatar
   */
  background?: string
  /**
   * @description 特殊效果
   *
   * @default undefined
   */
  special?: {
    /**
     * @description 角色立绘 URL
     */
    characterArtUrl: string
    /**
     * @description 左侧背景图片 URL
     */
    leftBackgroundImageUrl: string
    /**
     * @description 右侧背景图片 URL
     */
    rightBackgroundImageUrl: string
    /**
     * @description 阴影颜色
     */
    shadowColor: string
    /**
     * @description 背景图片裁切角度
     */
    deg: number
  }
}

export const しまかぜ: FriendInfo = {
  nickname: '舰队的偶像-岛风酱!',
  avatar: '/avatar.webp',
  des: '无业',
  url: 'https://shimakaze.dev',
  special: {
    characterArtUrl: '/assets/character.avif',
    leftBackgroundImageUrl: '/assets/background1.avif',
    rightBackgroundImageUrl: '/assets/background2.avif',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    deg: 45,
  },
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
