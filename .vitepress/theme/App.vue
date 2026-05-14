<template>
  <FriendsLayout v-if="frontmatter.layout === 'friends'" />
  <Teek.Layout v-else>
    <template #teek-home-card-my-after>
      <ClientOnly>
        <CalendarCard />
      </ClientOnly>
    </template>
  </Teek.Layout>
</template>

<script lang="ts" setup>
import { useData } from 'vitepress'
import Teek from 'vitepress-theme-teek'

import CalendarCard from './components/CalendarCard.vue'
import FriendsLayout from './layouts/FriendsLayout.vue'

const { frontmatter } = useData()
</script>
