<template>
  <BlogWrapper>
    <div class="vp-page vp-blog">
      <BlogHero>
        <template #info="{ tagline, isFullScreen, text, alt }">
          <HitokotoBlogHero v-if="text" :text="text" :alt="alt" />
        </template>
        <template #bg>
          <BingHeroBackground />
        </template>
      </BlogHero>
      <div class="blog-page-wrapper">
        <main id="main-content" class="vp-blog-main friends round-avatar">
          <DropTransition appear :delay="0.16">
            <div class="theme-hope-content">
              <div class="friend-card-panel">
                <div v-for="(group, groupName) in friends" :key="groupName">
                  <h4 v-text="groupName" />
                  <div class="vp-project-panel">
                    <FriendCard
                      v-for="(item, i) in group"
                      :key="`${groupName}-${i}`"
                      :friend="item" />
                  </div>
                </div>
              </div>
            </div>
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
import BlogHero from 'vuepress-theme-hope/blog/components/BlogHero.js'
import BlogWrapper from 'vuepress-theme-hope/blog/components/BlogWrapper.js'
import InfoPanel from 'vuepress-theme-hope/blog/components/InfoPanel.js'
import MarkdownContent from 'vuepress-theme-hope/components/MarkdownContent.js'
import { DropTransition } from 'vuepress-theme-hope/components/transitions/DropTransition.js'
import BingHeroBackground from 'vuepress-theme-hope/presets/BingHeroBackground.js'
import HitokotoBlogHero from 'vuepress-theme-hope/presets/HitokotoBlogHero.js'

import 'vuepress-theme-hope/modules/blog/styles/home.scss'
import FriendCard from '../components/FriendCard.vue'

const friends = しまかぜのともだち.reduce(
  (a, b) => {
    a[b.group ?? '默认分组'] ??= []
    a[b.group ?? '默认分组'].push(b)
    return a
  },
  {} as Record<string, typeof しまかぜのともだち>,
)
</script>

<style lang="scss">
main.friends.round-avatar {
  .vp-project-card {
    img.vp-project-image {
      border-radius: 9999px;
    }
  }
}
.friend-card-panel h4 {
  margin: 0 0.5rem;
}
</style>
