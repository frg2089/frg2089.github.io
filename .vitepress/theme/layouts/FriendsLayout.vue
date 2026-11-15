<template>
  <Transition mode="default" :duration="1000">
    <SpecialFriend
      v-if="current?.special"
      :key="current.nickname"
      :current
      :special="current.special" />
    <NormalFriend v-else-if="current" :key="`${current.nickname}`" :current />
  </Transition>

  <div class="friend-panel">
    <div
      v-for="(friend, i) in friends"
      :key="i"
      class="friend"
      :class="{ current: friend.nickname === current?.nickname }">
      <a
        :href="`${friend.nickname}`"
        :aria-label="friend.nickname"
        :aria-current="
          friend.nickname === current?.nickname ? 'page' : undefined
        ">
        <div class="avatar">
          <img :src="getAvatar(friend)" :alt="friend.nickname" />
        </div>
      </a>
    </div>
  </div>

  <Content />
</template>

<script lang="ts" setup>
import { Content, useData, useRoute } from 'vitepress'
import { computed, onBeforeUnmount, onMounted } from 'vue'

import NormalFriend from '../components/NormalFriend.vue'
import SpecialFriend from '../components/SpecialFriend.vue'

const route = useRoute()
const { isDark } = useData()

const friends = しまかぜのともだち

const current = computed(() => {
  if (!route.data.params) return しまかぜ
  const id = route.data.params.id as string | undefined
  if (!id) return しまかぜ

  return friends.find(i => i.nickname === decodeURIComponent(id)) ?? しまかぜ
})

const getAvatar = (friend: (typeof current)['value']) => {
  if (typeof friend.avatar === 'string') return friend.avatar
  if ('src' in friend.avatar) return friend.avatar.src
  if (isDark.value && friend.avatar.dark) return friend.avatar.dark
  return friend.avatar.light
}

// 全屏剧院在手机上不应跟随页面滚动/回弹
onMounted(() => document.documentElement.classList.add('friends-theater'))
onBeforeUnmount(() =>
  document.documentElement.classList.remove('friends-theater'),
)
</script>

<style lang="scss">
$avatar-size: 4rem;

// 底部好友栏占用的高度（含移动端安全区），供剧院组件避让
:root {
  --friends-dock-clearance: 8rem;

  // 手机竖屏 / 横屏矮窗口
  @media (max-width: 768px), (max-height: 560px) {
    --friends-dock-clearance: calc(4.5rem + env(safe-area-inset-bottom));
  }
}

// 全屏剧院：禁止页面滚动 / 回弹
html.friends-theater {
  overflow: hidden;
  overscroll-behavior: none;
}

// content
.friend-panel {
  --friends-avatar-size: #{$avatar-size};
  --friends-dock-gap: 1rem;
  --friends-dock-padding: 2rem;

  display: flex;
  gap: var(--friends-dock-gap);
  position: fixed;
  overflow-x: auto;
  overflow-y: hidden;
  padding: var(--friends-dock-padding);
  padding-left: calc(var(--friends-dock-padding) + env(safe-area-inset-left));
  padding-right: calc(var(--friends-dock-padding) + env(safe-area-inset-right));
  padding-bottom: calc(
    var(--friends-dock-padding) + env(safe-area-inset-bottom)
  );
  bottom: 0;
  left: 0;
  right: 0;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  scroll-padding-inline: var(--friends-dock-padding);
  scroll-snap-type: x proximity;

  .friend {
    filter: brightness(90%);
    flex-shrink: 0;
    scroll-snap-align: center;

    &.current {
      filter: brightness(110%) contrast(120%)
        drop-shadow(0 0 0.25rem var(--vp-c-important-1))
        drop-shadow(0 0 1rem var(--vp-c-important-1));
    }

    .avatar {
      img {
        display: block;
        object-fit: cover;
        width: var(--friends-avatar-size);
        height: var(--friends-avatar-size);
        border-radius: 9999px;
      }
    }
  }

  @media (max-width: 768px), (max-height: 560px) {
    --friends-avatar-size: 3rem;
    --friends-dock-gap: 0.75rem;
    --friends-dock-padding: 0.75rem;

    background: linear-gradient(to top, rgb(0 0 0 / 45%), transparent);
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
