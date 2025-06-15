<template>
  <Layout>
    <template #heroInfo="{ text, tagline, style, isFullScreen }">
      <HitokotoBlogHero v-if="text" :text="text" :alt="text" />
    </template>
    <template #heroBg>
      <BingHeroBackground />
    </template>
    <template #content>
      <div class="blog-page-wrapper">
        <main id="main-content" class="vp-blog-main">
          <DropTransition appear :delay="0.16">
            <div class="theme-hope-content">
              <div class="friend-card-panel">
                <div v-for="(group, groupName) in friends" :key="groupName">
                  <h4 v-if="groupName !== '<default>'" v-text="groupName" />
                  <div class="vp-project-panel">
                    <FriendCard
                      v-for="(item, i) in group"
                      :key="`${groupName}-${i}`"
                      :friend="item" />
                    <div
                      v-for="i in placeholderCalc(group)"
                      class="friend-placeholder" />
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
    </template>
  </Layout>
</template>

<script lang="ts" setup>
import InfoPanel from 'vuepress-theme-hope/components/blog/InfoPanel'
import DropTransition from 'vuepress-theme-hope/components/transitions/DropTransition'
import Layout from 'vuepress-theme-hope/layouts/base/Layout.js'
import BingHeroBackground from 'vuepress-theme-hope/presets/BingHeroBackground.js'
import HitokotoBlogHero from 'vuepress-theme-hope/presets/HitokotoBlogHero.js'
import FriendCard from '../components/FriendCard.vue'
import MarkdownContent from '../components/MarkdownContent.vue'

const placeholderCalc = (group: unknown[]) => {
  let i = 3
  if (window.document.body.clientWidth >= 1440) {
    // pc
    i = 4
  } else if (window.document.body.clientWidth <= 959) {
    // pad
    i = 2
  }
  // else if (window.document.body.clientWidth >= 1280) {
  //   // laptop
  // }  else if (window.document.body.clientWidth >= 719) {
  //   // tablet
  // } else if (window.document.body.clientWidth >= 419) {
  //   // mobile
  // }
  const a = group.length % i
  if (!a) return 0
  return i - a
}

const friends = しまかぜのともだち.reduce(
  (a, b) => {
    a[b.group ?? '<default>'] ??= []
    a[b.group ?? '<default>'].push(b)
    return a
  },
  {} as Record<string, typeof しまかぜのともだち>,
)
</script>

<style lang="scss">
.vp-hero-info {
  flex-direction: column;
}

.friend-card-panel {
  h4 {
    margin: 0 0.5rem;
  }
  .vp-project-panel {
    z-index: 99999;
    display: grid;
    justify-content: center;

    grid-template-columns: repeat(3, 1fr);
    .vp-project-card {
      width: calc(100% - 40px);

      &:nth-child(3n + 1) {
        .friend-card-hover {
          transform-origin: 0 0;
        }
      }
      &:nth-child(3n + 2) {
        .friend-card-hover {
          transform-origin: 50% 0;
        }
      }
      &:nth-child(3n + 3) {
        .friend-card-hover {
          transform-origin: 100% 0;
          left: unset;
          right: 0;
        }
      }
      &:nth-last-child(3) {
        .friend-card-hover {
          transform-origin: 0 100%;
        }
      }
      &:nth-last-child(2) {
        .friend-card-hover {
          transform-origin: 50% 100%;
        }
      }
      &:nth-last-child(1) {
        .friend-card-hover {
          transform-origin: 100% 100%;
          left: unset;
          right: 0;
        }
      }
    }

    @media (max-width: hope-config.$pad) {
      grid-template-columns: repeat(2, 1fr);
      .vp-project-card {
        &:nth-child(2n + 1) {
          .friend-card-hover {
            transform-origin: 0 0;
          }
        }
        &:nth-child(2n + 2) {
          .friend-card-hover {
            transform-origin: 100% 0;
            left: unset;
            right: 0;
          }
        }
        &:nth-last-child(2) {
          .friend-card-hover {
            transform-origin: 0 100%;
          }
        }
        &:nth-last-child(1) {
          .friend-card-hover {
            transform-origin: 100% 100%;
            left: unset;
            right: 0;
          }
        }
      }
    }

    @media (min-width: hope-config.$pc) {
      grid-template-columns: repeat(4, 1fr);
      .vp-project-card {
        &:nth-child(4n + 1) {
          .friend-card-hover {
            transform-origin: 0 0;
          }
        }
        &:nth-child(4n + 2) {
          .friend-card-hover {
            transform-origin: 33% 0;
          }
        }
        &:nth-child(4n + 3) {
          .friend-card-hover {
            transform-origin: 66% 0;
          }
        }
        &:nth-child(4n + 4) {
          .friend-card-hover {
            transform-origin: 100% 0;
            left: unset;
            right: 0;
          }
        }
        &:nth-last-child(4) {
          .friend-card-hover {
            transform-origin: 0 100%;
          }
        }
        &:nth-last-child(3) {
          .friend-card-hover {
            transform-origin: 33% 100%;
          }
        }
        &:nth-last-child(2) {
          .friend-card-hover {
            transform-origin: 66% 100%;
          }
        }
        &:nth-last-child(1) {
          .friend-card-hover {
            transform-origin: 100% 100%;
            left: unset;
            right: 0;
          }
        }
      }
    }
  }
}
</style>
