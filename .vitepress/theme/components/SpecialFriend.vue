<template>
  <div class="theater">
    <div class="theater__backdrop theater__backdrop--right" />
    <div class="theater__backdrop theater__backdrop--left" />
    <div class="theater__right">
      <div class="theater__name" v-text="current.nickname" />
    </div>
    <div class="theater__left">
      <div class="theater__desc" v-text="current.des" />
    </div>
    <div class="theater__character-art">
      <img
        class="theater__character-art-image"
        :src="special.characterArtUrl"
        :alt="alt" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

type FriendItem = (typeof しまかぜのともだち)[0]
const { current, special } = defineProps<{
  current: FriendItem
  special: Exclude<FriendItem['special'], undefined>
}>()

const alt = computed(() => {
  if (typeof current.avatar !== 'string')
    return current.avatar.alt ?? current.nickname
  return current.nickname
})

const leftBackgroundImageUrl = computed(
  () => `url(${special.leftBackgroundImageUrl})`,
)
const rightBackgroundImageUrl = computed(
  () => `url(${special.rightBackgroundImageUrl})`,
)
const dropShadow = computed(
  () =>
    `drop-shadow(0 0 0.25rem ${special.shadowColor}) drop-shadow(0 0 1rem ${special.shadowColor})`,
)
const leftGradientAngle = computed(
  () => `linear-gradient(${special.deg + 90}deg, black 45%, transparent 55%)`,
)
const rightGradientAngle = computed(
  () => `linear-gradient(${special.deg - 90}deg, black 45%, transparent 55%)`,
)
</script>

<style lang="scss" scoped>
@mixin fullscreen {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.theater {
  @include fullscreen;

  & > * {
    @include fullscreen;
  }

  &__backdrop {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    animation-duration: 1s;
    animation-delay: 0;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);

    &--left,
    &--right {
      filter: brightness(50%);
    }

    &--left {
      background-position: left center;
      background-image: v-bind('leftBackgroundImageUrl');
      mask-image: v-bind('leftGradientAngle');

      animation-name: background-left;
    }
    &--right {
      background-position: right center;
      background-image: v-bind('rightBackgroundImageUrl');
      mask-image: v-bind('rightGradientAngle');

      animation-name: background-right;
    }
  }

  &__name,
  &__desc {
    filter: brightness(200%) v-bind('dropShadow');
    position: fixed;
    z-index: 2;
    font-size: 4rem;
    line-height: 6rem;

    white-space: pre-wrap;

    animation-name: text-intro;

    animation-duration: 1s;
    animation-delay: 1s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  &__desc {
    animation-delay: 1.2s;
    left: 5%;
    bottom: 20%;
  }

  &__name {
    font-size: 6rem;
    right: 4rem;
    top: 4rem;
  }

  &__character-art {
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    &-image {
      object-fit: cover;
      max-height: calc(100% - 4rem);

      filter: brightness(110%) v-bind('dropShadow');

      animation-name: character-art;
      animation-duration: 1s;
      animation-delay: 0.5s;
      animation-fill-mode: both;
      animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
    }
  }

  &.v-leave-active {
    .theater__backdrop {
      animation-delay: 0.5s;

      &--left {
        animation-name: background-left-leave;
      }

      &--right {
        animation-name: background-right-leave;
      }
    }

    .theater__name,
    .theater__desc {
      animation-name: text-leave;

      animation-duration: 1s;
      animation-delay: 0s;
    }

    .theater__character-art-image {
      animation-name: character-art-leave;
    }
  }

  /* ---- 手机竖屏 / 横屏矮窗口适配 ---- */
  @media (max-width: 768px), (max-height: 560px) {
    // 手机上两张背景改为一上一下：左图贴左上角、右图贴右下角，中间叠压过渡
    &__backdrop {
      &--left {
        top: 0;
        left: 0;
        right: auto;
        bottom: auto;
        width: 100%;
        height: 90%;
        background-position: 25% center;
      }

      &--right {
        top: auto;
        left: auto;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 90%;
        background-position: 70% center;
      }
    }

    &__name,
    &__desc {
      max-width: calc(
        100% - 2rem - env(safe-area-inset-left) - env(safe-area-inset-right)
      );
      font-size: clamp(1.125rem, 4.5vmin, 2rem);
      line-height: 1.35;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    &__name {
      right: calc(1rem + env(safe-area-inset-right));
      top: calc(1rem + env(safe-area-inset-top));
      max-width: calc(100% - 2rem);
      font-size: clamp(1.5rem, 8vmin, 4rem);
      text-align: right;
    }

    &__desc {
      left: calc(1rem + env(safe-area-inset-left));
      bottom: calc(var(--friends-dock-clearance, 5rem) + 1rem);
      max-width: 82%;
    }

    &__character-art {
      padding-bottom: var(--friends-dock-clearance, 5rem);
    }

    &__character-art-image {
      width: 100%;
      height: auto;
      max-height: calc(100vh - var(--friends-dock-clearance, 5rem) - 4rem);
      max-height: calc(100dvh - var(--friends-dock-clearance, 5rem) - 4rem);
      object-fit: contain;
    }

    &__backdrop {
      &--left {
        animation-name: background-top;
      }

      &--right {
        animation-name: background-bottom;
      }
    }
    &.v-leave-active {
      .theater__backdrop {
        &--left {
          animation-name: background-top-leave;
        }

        &--right {
          animation-name: background-bottom-leave;
        }
      }
    }
  }
}

@keyframes text-intro {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0%);
  }
}

@keyframes text-leave {
  0% {
    opacity: 1;
    transform: translateY(0%);
  }
  100% {
    opacity: 0;
    transform: translateY(100%);
  }
}

@keyframes background-left {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0%);
  }
}
@keyframes background-left-leave {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes background-right {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0%);
  }
}
@keyframes background-right-leave {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes background-top {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0%);
  }
}

@keyframes background-top-leave {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-100%);
  }
}

@keyframes background-bottom {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0%);
  }
}

@keyframes background-bottom-leave {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(100%);
  }
}

@keyframes character-art {
  0% {
    transform: translateY(100vh);
  }
  100% {
    transform: translateY(0%);
  }
}

@keyframes character-art-leave {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
