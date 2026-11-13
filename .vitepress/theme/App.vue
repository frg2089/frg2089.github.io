<template>
  <Transition mode="out-in" :duration="500" name="fade">
    <FriendsLayout v-if="frontmatter.layout === 'friends'" key="friends" />
    <Theme.Layout v-else :key="frontmatter.layout" />
  </Transition>
</template>

<script lang="ts" setup>
import Theme from '@sugarat/theme'
import { useData } from 'vitepress'

import FriendsLayout from './layouts/FriendsLayout.vue'

const { frontmatter } = useData()
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 自定义首页背景图 */
.VPHome::before,
.VPDoc::before {
  content: '';
  inset: 0;
  position: fixed;
  top: 0;
  z-index: -1;
  background-repeat: no-repeat;
  min-height: 100%;
  background-image: url(https://www.loliapi.com/acg/);
  background-size: cover;
}

.VPContent {
  padding-top: unset !important;
  &.has-sidebar {
    html.sidebar-collapsed &,
    html.sidebar-auto-hidden & {
      padding-left: unset !important;
    }
    padding-right: unset !important;
  }

  & > * {
    min-height: 100vh;
  }
}

.VPDoc {
  padding-top: calc(var(--vp-nav-height) + 32px) !important;
  background: radial-gradient(
    ellipse,
    rgba(var(--bg-gradient-home), 1) 0%,
    rgba(var(--bg-gradient-home), 0) 700%
  );

  @media (min-width: 768px) {
    & {
      padding-top: calc(var(--vp-nav-height) + 48px) !important;
    }
  }
}

.VPSidebar {
  background-color: rgba(var(--bg-gradient-home), 0.9) !important;
}

.VPNavBar {
  backdrop-filter: blur(10px);
  transition-property: backdrop-filter;

  &,
  .content-body {
    background: unset !important;
  }

  &.top {
    backdrop-filter: unset;
    border-bottom: unset !important;
  }
}
</style>
