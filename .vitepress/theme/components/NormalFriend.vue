<template>
  <div class="theater">
    <div
      class="theater__backdrop"
      :style="{
        '--background-url': `url(${current.background ?? current.avatar})`,
      }">
    </div>
    <div class="theater__decor">
      <div class="theater__decor-line theater__decor-line--wide"></div>
      <div class="theater__decor-line theater__decor-line--wide"></div>
      <div class="theater__decor-line theater__decor-line--thin"></div>
      <div class="theater__decor-line theater__decor-line--thin"></div>
    </div>
    <div class="theater__avatar-pane">
      <img class="theater__avatar" :src="avatar" :alt="current.nickname" />
    </div>
    <div class="theater__info-pane">
      <div class="theater__text">
        <div class="theater__name" v-text="current.nickname" />
        <div class="theater__desc" v-text="current.des" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useData } from 'vitepress'
import { computed } from 'vue'

const { current } = defineProps<{
  current: (typeof しまかぜのともだち)[0]
}>()

const { isDark } = useData()

const avatar = computed(() => {
  if (typeof current.avatar === 'string') return current.avatar
  if ('src' in current.avatar) return current.avatar.src
  if (isDark.value && current.avatar.dark) return current.avatar.dark
  return current.avatar.light
})
</script>

<style lang="scss" scoped>
$deg: 22deg;

@mixin fullscreen {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

@keyframes spin {
  0% {
    transform: rotate(-90deg);
  }
  100% {
    transform: rotate(270deg);
  }
}

@keyframes left-intro {
  0% {
    transform: translateX(-100vw);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes right-intro {
  0% {
    transform: translateX(100vw);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes text-intro {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(8rem);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes line1-intro {
  0% {
    transform: rotate($deg) translateX(200vw);
  }
  100% {
    transform: rotate($deg) translateX(-100vw);
  }
}

@keyframes line2-intro {
  0% {
    transform: rotate($deg) translateX(200vw);
  }
  100% {
    transform: rotate($deg) translateX(-100vw);
  }
}

@keyframes line3-intro {
  0% {
    transform: rotate($deg) translateX(100vw);
  }
  100% {
    transform: rotate($deg) translateX(11.5rem);
  }
}

@keyframes line4-intro {
  0% {
    transform: rotate($deg) translateX(100vw);
  }
  100% {
    transform: rotate($deg) translateX(12.5rem);
  }
}

@keyframes left-leave {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100vw);
  }
}

@keyframes right-leave {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100vw);
  }
}

@keyframes line3-leave {
  0% {
    transform: rotate($deg) translateX(11.5rem);
  }
  100% {
    transform: rotate($deg) translateX(-100vw);
  }
}

@keyframes line4-leave {
  0% {
    transform: rotate($deg) translateX(12.5rem);
  }
  100% {
    transform: rotate($deg) translateX(-100vw);
  }
}

.theater {
  &__avatar-pane,
  &__info-pane,
  &__backdrop {
    @include fullscreen;
    display: flex;
    align-items: center;
    justify-content: center;

    animation-duration: 1s;
    animation-delay: 1s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  &__avatar-pane {
    animation-name: left-intro;
    right: unset;
  }

  &__info-pane,
  &__backdrop {
    animation-name: right-intro;
    left: unset;
    height: 100vh;
    height: 100dvh;
    width: min(100vh, 100vw);
  }

  &__avatar {
    filter: brightness(100%);
    position: relative;
    margin-left: min(10vh, 10vw);
    margin-right: min(10vh, 10vw);
    height: min(80vh, 80vw);
    width: min(80vh, 80vw);
    object-fit: cover;
    border-radius: 9999px;

    animation-name: spin;
    animation-duration: 10s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  &__backdrop {
    filter: brightness(50%);
    background-image: var(--background-url);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    mask-image: linear-gradient(-68deg, black 70%, transparent 70%);
  }

  &__text {
    filter: brightness(120%);
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
  }

  &__name,
  &__desc {
    animation-name: text-intro;
    animation-duration: 1s;
    animation-delay: 1.5s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);

    white-space: pre-wrap;
    line-height: 1.2;
  }

  &__name {
    position: absolute;
    right: 4rem;
    top: 4rem;
    font-size: 6rem;
  }

  &__desc {
    animation-delay: 1.75s;
    color: var(--vp-c-important-1);

    position: absolute;
    left: 8rem;
    bottom: 4rem;
    font-size: 4rem;
  }

  &__decor {
    grid-column: 1 / span 2;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;

    &-line {
      filter: brightness(200%);
      background-color: var(--vp-c-important-3);
      position: absolute;
      top: -150%;
      height: 400vh;

      animation-duration: 1s;
      animation-fill-mode: both;
      animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);

      &--wide {
        width: 5vw;
      }

      &--thin {
        width: 0.5rem;
        right: min(100vh, 100vw);
      }

      &:nth-child(1) {
        animation-name: line1-intro;
        animation-delay: 0ms;
        transform: rotate($deg);
      }

      &:nth-child(2) {
        animation-name: line2-intro;
        animation-delay: 200ms;
        transform: rotate($deg);
      }

      &:nth-child(3) {
        animation-name: line3-intro;
        animation-delay: 0.8s;
      }

      &:nth-child(4) {
        animation-name: line4-intro;
        animation-delay: 1s;
      }
    }
  }

  &.v-leave-active {
    .theater__avatar-pane {
      animation-name: left-leave;
      animation-delay: 0s;
    }

    .theater__info-pane,
    .theater__backdrop {
      animation-name: right-leave;
      animation-delay: 0s;
    }

    .theater__decor-line:nth-child(3) {
      animation-name: line3-leave;
      animation-delay: 0s;
    }

    .theater__decor-line:nth-child(4) {
      animation-name: line4-leave;
      animation-delay: 0.2s;
    }
  }

  /* ---- 手机竖屏 / 横屏矮窗口适配 ---- */
  @media (max-width: 768px), (max-height: 560px) {
    &__avatar-pane,
    &__info-pane,
    &__backdrop {
      animation-duration: 0.8s;
    }

    // 头像全屏居中（水平 + 垂直）
    &__avatar-pane {
      right: 0;
    }

    &__avatar {
      margin: 0;
      height: min(48vmin, 60vw);
      width: min(48vmin, 60vw);
    }

    &__backdrop {
      mask-image: none;
    }

    // 横屏时也让背景铺满，避免右侧画面只占一半
    &__info-pane,
    &__backdrop {
      left: 0;
      width: 100vw;
    }

    // 斜线在这个尺寸下会横穿头像和文字，只保留扫过的入场动画
    &__decor-line--thin {
      display: none;
    }

    &__name {
      right: calc(2rem + env(safe-area-inset-right));
      top: calc(2rem + env(safe-area-inset-top));
      max-width: calc(100% - 2rem);
      font-size: clamp(2rem, 7vmin, 4rem);
      text-align: right;
      text-shadow: 0 0 0.75rem rgb(0 0 0 / 70%);
    }

    &__desc {
      left: calc(1rem + env(safe-area-inset-left));
      bottom: calc(var(--friends-dock-clearance, 5rem) + 1rem);
      max-width: 88%;
      font-size: clamp(1.625rem, 4.5vmin, 2.5rem);
      text-shadow: 0 0 0.75rem rgb(0 0 0 / 70%);
    }
  }
}
</style>
