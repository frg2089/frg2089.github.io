<template>
  <div class="theater">
    <div class="background right"> </div>
    <div class="background left"> </div>
    <div class="right">
      <div class="text name" v-text="current.name" />
    </div>
    <div class="left">
      <div class="text desc" v-text="current.desc" />
    </div>
    <div class="characterArt">
      <img :src="special.characterArtUrl" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

type FriendItem = (typeof しまかぜのともだち)[0]
const props = defineProps<{
  current: FriendItem
  special: Exclude<FriendItem['special'], undefined>
}>()

const leftBackgroundImageUrl = computed(
  () => `url(${props.special.leftBackgroundImageUrl})`,
)
const rightBackgroundImageUrl = computed(
  () => `url(${props.special.rightBackgroundImageUrl})`,
)
const dropShadow = computed(
  () =>
    `drop-shadow(0 0 0.25rem ${props.special.shadowColor}) drop-shadow(0 0 1rem ${props.special.shadowColor})`,
)
const leftGradientAngle = computed(
  () =>
    `linear-gradient(${props.special.deg + 90}deg, black 45%, transparent 55%)`,
)
const rightGradientAngle = computed(
  () =>
    `linear-gradient(${props.special.deg - 90}deg, black 45%, transparent 55%)`,
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

  .background {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    animation-duration: 1s;
    animation-delay: 0;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);

    &.left,
    &.right {
      filter: brightness(50%);
    }

    &.left {
      background-position: left center;
      background-image: v-bind('leftBackgroundImageUrl');
      mask-image: v-bind('leftGradientAngle');

      animation-name: background-left;
    }
    &.right {
      background-position: right center;
      background-image: v-bind('rightBackgroundImageUrl');
      mask-image: v-bind('rightGradientAngle');

      animation-name: background-right;
    }
  }

  .text {
    filter: brightness(200%) v-bind('dropShadow');
    position: fixed;
    font-size: 4rem;
    line-height: 6rem;

    white-space: pre-wrap;

    animation-name: text-intro;

    animation-duration: 1s;
    animation-delay: 1s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  .left {
    .desc {
      animation-delay: 1.2s;
      left: 5%;
      bottom: 20%;
    }
  }

  .right {
    .name {
      font-size: 6rem;
      right: 10%;
      top: 15%;
    }
  }

  .characterArt {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
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
    .background {
      animation-delay: 0.5;

      &.left {
        animation-name: background-left-leave;
      }

      &.right {
        animation-name: background-right-leave;
      }
    }

    .text {
      animation-name: text-leave;

      animation-duration: 1s;
      animation-delay: 0s;
    }
    .characterArt {
      img {
        animation-name: character-art-leave;
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
