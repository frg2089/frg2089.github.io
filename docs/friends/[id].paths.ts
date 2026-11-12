import friends from '../../.vitepress/friends'

export default {
  paths() {
    return friends.map(friend => ({
      params: { id: friend.nickname },
    }))
  },
}
