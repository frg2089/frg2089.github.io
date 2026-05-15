<template>
  <div class="theater">
    <div
      class="right background"
      :style="{
        '--background-url': `url(${current.background ?? current.avatar})`,
      }">
    </div>
    <div class="line-container">
      <div class="line group1"></div>
      <div class="line group1"></div>
      <div class="line group2"></div>
      <div class="line group2"></div>
    </div>
    <div class="left">
      <img class="avatar" :src="current.avatar" :alt="current.name" />
    </div>
    <div class="right">
      <div class="text">
        <div class="name" v-text="current.name" />
        <div class="desc" v-text="current.desc" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  current: (typeof しまかぜのともだち)[0]
}>()
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
  .left,
  .right {
    @include fullscreen;
    display: flex;
    align-items: center;
    justify-content: center;

    animation-duration: 1s;
    animation-delay: 1s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  .left {
    animation-name: left-intro;
    right: unset;
  }
  .right {
    animation-name: right-intro;
    left: unset;
    height: 100vh;
    width: 100vh;
  }

  .avatar {
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

  .background {
    filter: brightness(50%);
    background-image: var(--background-url);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    mask-image: linear-gradient(-68deg, black 70%, transparent 70%);
  }

  .text {
    filter: brightness(120%);
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;

    .name,
    .desc {
      animation-name: text-intro;

      animation-duration: 1s;
      animation-delay: 1.5s;
      animation-fill-mode: both;
      animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);

      white-space: pre-wrap;
      line-height: 1.2;
    }

    .name {
      position: absolute;
      right: 4rem;
      top: 4rem;
      font-size: 6rem;
    }

    .desc {
      animation-delay: 1.75s;
      color: var(--vp-c-important-1);

      position: absolute;
      left: 8rem;
      bottom: 4rem;
      font-size: 4rem;
    }
  }

  .line-container {
    grid-column: 1 / span 2;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;

    .line {
      filter: brightness(200%);
      background-color: var(--vp-c-important-3);
      position: absolute;
      top: -150%;
      height: 400vh;

      animation-duration: 1s;
      animation-fill-mode: both;
      animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    .group1 {
      width: 5vw;
    }
    .line:nth-child(1) {
      animation-name: line1-intro;
      animation-delay: 0ms;
      transform: rotate($deg);
    }
    .line:nth-child(2) {
      animation-name: line2-intro;
      animation-delay: 200ms;
      transform: rotate($deg);
    }

    .group2 {
      width: 0.5rem;
      right: calc(100vh);
    }
    .line:nth-child(3) {
      animation-name: line3-intro;
      animation-delay: 0.8s;
    }
    .line:nth-child(4) {
      animation-name: line4-intro;
      animation-delay: 1s;
    }
  }

  &.v-leave-active {
    .left {
      animation-name: left-leave;
      animation-delay: 0s;
    }
    .right {
      animation-name: right-leave;
      animation-delay: 0s;
    }

    .line-container {
      .line:nth-child(3) {
        animation-name: line3-leave;
        animation-delay: 0s;
      }
      .line:nth-child(4) {
        animation-name: line4-leave;
        animation-delay: 0.2s;
      }
    }
  }
}
</style>
