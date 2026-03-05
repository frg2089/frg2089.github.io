<template>
  <Teek.Layout>
    <template #teek-home-card-my-after>
      <CalendarCard />
    </template>
  </Teek.Layout>
</template>

<script lang="ts" setup>
import { useData } from 'vitepress'
import Teek from 'vitepress-theme-teek'
import CalendarCard from './components/CalendarCard.vue'

const { frontmatter } = useData()
</script>
