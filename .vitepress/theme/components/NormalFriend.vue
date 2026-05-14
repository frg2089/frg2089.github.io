<template>
  <div class="theater">
    <div class="left">
      <img class="avatar" :src="current.avatar" :alt="current.name" />
    </div>
    <div class="right">
      <img
        class="background"
        :src="current.background ?? current.avatar"
        :alt="current.name" />
    </div>
    <div class="line-container">
      <div class="line group1"></div>
      <div class="line group1"></div>
      <div class="line group2"></div>
      <div class="line group2"></div>
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
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0%);
  }
}

@keyframes right-intro {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0%);
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
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes right-leave {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
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
  @include fullscreen;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;

  .left,
  .right {
    grid-area: 1 / 1;

    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;

    animation-duration: 1s;
    animation-delay: 1s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  .left {
    grid-column: 1;
    animation-name: left-intro;
  }
  .right {
    grid-column: 2;
    animation-name: right-intro;
    position: relative;
  }

  .avatar {
    filter: brightness(100%);
    position: relative;
    left: 5%;
    height: 80%;
    object-fit: cover;
    border-radius: 9999px;

    animation-name: spin;
    animation-duration: 10s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  .background {
    filter: brightness(50%);
    position: absolute;
    right: 0;
    height: 100%;
    object-fit: cover;
    mask-image: linear-gradient(-68deg, black 70%, transparent 70%);
  }

  .text {
    filter: brightness(120%);
    position: relative;
    width: 100%;
    right: 0%;
    text-align: center;
    font-size: 4rem;

    * {
      animation-name: text-intro;

      animation-duration: 1s;
      animation-delay: 1.5s;
      animation-fill-mode: both;
      animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);

      white-space: pre-wrap;
    }

    .name {
      font-size: 6rem;
      margin-bottom: 8rem;
    }

    .desc {
      animation-delay: 1.75s;
      color: var(--vp-c-important-1);
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
      height: 400%;

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
      right: 50%;
    }
    .line:nth-child(3) {
      animation-name: line3-intro;

      animation-delay: 0.8s;
      transform: rotate($deg) translateX(11.5rem);
    }
    .line:nth-child(4) {
      animation-name: line4-intro;
      animation-delay: 1s;
      transform: rotate($deg) translateX(12.5rem);
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
