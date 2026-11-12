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
      <a v-if="friend.avatar" :href="`${friend.nickname}`">
        <div class="avatar">
          <img
            v-if="typeof friend.avatar === 'string'"
            :src="friend.avatar"
            :alt="friend.nickname" />
          <img
            v-else-if="'src' in friend.avatar"
            :src="friend.avatar.src"
            :alt="friend.avatar.alt ?? friend.nickname" />
          <img
            v-else-if="isDark"
            :src="friend.avatar.dark"
            :alt="friend.avatar.alt ?? friend.nickname" />
          <img
            v-else
            :src="friend.avatar.light"
            :alt="friend.avatar.alt ?? friend.nickname" />
        </div>
      </a>
    </div>
  </div>

  <Content />
</template>

<script lang="ts" setup>
import { Content, useRoute } from 'vitepress'
import { computed } from 'vue'

import NormalFriend from '../components/NormalFriend.vue'
import SpecialFriend from '../components/SpecialFriend.vue'

const route = useRoute()

const friends = しまかぜのともだち

const current = computed(() => {
  if (!route.data.params) return しまかぜ
  const id = route.data.params.id as string | undefined
  if (!id) return しまかぜ

  return friends.find(i => i.nickname === decodeURIComponent(id)) ?? しまかぜ
})

const isDark = computed(() =>
  document.querySelector('html')?.classList.contains('dark'),
)
</script>

<style lang="scss">
$avatar-size: 4rem;
// content
.friend-panel {
  display: flex;
  gap: 1rem;
  position: fixed;
  overflow-x: auto;
  padding: 2rem;
  bottom: 0;
  left: 0;
  right: 0;

  .friend {
    filter: brightness(90%);
    flex-shrink: 0;

    &.current {
      filter: brightness(110%) contrast(120%)
        drop-shadow(0 0 0.25rem var(--vp-c-important-1))
        drop-shadow(0 0 1rem var(--vp-c-important-1));
    }

    .avatar {
      img {
        object-fit: cover;
        width: $avatar-size;
        height: $avatar-size;
        border-radius: 9999px;
      }
    }
  }
}
</style>
