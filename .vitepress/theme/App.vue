<template>
  <FriendsLayout v-if="frontmatter.layout === 'friends'" />
  <Theme.Layout v-else>
    <template #home-hero-after>
      <ClientOnly>
        <CalendarCard />
      </ClientOnly>
    </template>
  </Theme.Layout>
</template>

<script lang="ts" setup>
import Theme from '@sugarat/theme'
import { useData } from 'vitepress'

import CalendarCard from './components/CalendarCard.vue'
import FriendsLayout from './layouts/FriendsLayout.vue'

const { frontmatter } = useData()
</script>

<style>
/* 自定义首页背景图 */
.VPHome::before {
  background-image: url(https://www.loliapi.com/acg/);
  background-size: cover;
}
</style>
