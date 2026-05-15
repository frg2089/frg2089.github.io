<template>
  <Transition mode="default" :duration="1000">
    <SpecialFriend
      v-if="current?.special"
      :key="current.name"
      :current
      :special="current.special" />
    <NormalFriend v-else-if="current" :key="`${current.name}`" :current />
    <div v-else class="content">
      <!-- <Content /> -->
    </div>
  </Transition>

  <div class="friend-panel">
    <div
      v-for="(friend, i) in friends"
      :key="i"
      class="friend"
      :class="{ current: friend.name === current?.name }">
      <a v-if="friend.avatar" :href="`#${friend.name}`">
        <div class="avatar">
          <img :src="friend.avatar" :alt="friend.alt ?? friend.name" />
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Content } from 'vitepress'
import { computed, onMounted, ref } from 'vue'

import NormalFriend from '../components/NormalFriend.vue'
import SpecialFriend from '../components/SpecialFriend.vue'

const friends = しまかぜのともだち

const current = ref<(typeof しまかぜのともだち)[0]>()

onMounted(() => {
  const updateCurrent = () =>
    (current.value = friends.find(
      i => i.name === decodeURIComponent(location.hash.substring(1)),
    ))
  window.addEventListener('hashchange', updateCurrent)
  updateCurrent()
})
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
