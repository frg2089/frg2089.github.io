<template>
  <BlogWrapper>
    <div class="page blog">
      <BlogHero>
        <template #heroInfo="{ tagline, isFullScreen, ...heroInfo }">
          <HitokotoBlogHero v-bind="heroInfo" />
        </template>
        <template #heroBg>
          <BingHeroBackground />
        </template>
      </BlogHero>
      <div class="blog-page-wrapper custom">
        <main
          class="blog-home friends"
          :class="{ 'round-friends': config.roundAvatar }"
          id="main-content">
          <DropTransition appear :delay="0.16">
            <ProjectPanel />
          </DropTransition>
          <DropTransition appear :delay="0.28">
            <MarkdownContent />
          </DropTransition>
        </main>
        <DropTransition appear :delay="0.4">
          <InfoPanel />
        </DropTransition>
      </div>
    </div>
  </BlogWrapper>
</template>

<script lang="ts" setup>
// @ts-nocheck
import MarkdownContent from '@theme-hope/components/MarkdownContent'
import DropTransition from '@theme-hope/components/transitions/DropTransition'
import InfoPanel from '@theme-hope/modules/blog/components/InfoPanel'
import ProjectPanel from '@theme-hope/modules/blog/components/ProjectPanel'
import BlogWrapper from '@theme-hope/modules/blog/components/BlogWrapper'
import BlogHero from '@theme-hope/modules/blog/components/BlogHero'
import BingHeroBackground from 'vuepress-theme-hope/presets/BingHeroBackground.js'
import HitokotoBlogHero from 'vuepress-theme-hope/presets/HitokotoBlogHero.js'
import { useBlogOptions } from '@theme-hope/modules/blog/composables/index'

import 'vuepress-theme-hope/modules/blog/styles/home.scss'

const config = useBlogOptions()
</script>

<style lang="scss">
main.friends.round-friends {
  .project-card {
    img.image {
      border-radius: 9999px;
    }
  }
}
</style>
