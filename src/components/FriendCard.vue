<template>
  <a
    class="vp-project-card"
    :href="friend.link"
    :title="friend.name"
    target="_blank">
    <div class="friend-card-container">
      <img
        class="friend-logo"
        :src="friend.icon"
        :alt="friend.name"
        width="48" />
      <div class="friend-text">
        <div class="friend-name" v-text="friend.name" />
        <div class="friend-desc" v-text="friend.desc" />
      </div>
    </div>
    <div class="friend-card-hover">
      <img class="friend-hover-logo" :src="friend.icon" :alt="friend.name" />
      <div class="friend-hover-text">
        <div class="friend-name" v-text="friend.name" />
        <div class="friend-desc" v-text="friend.desc" />
      </div>
      <img class="friend-hover-logo-2" :src="friend.icon" :alt="friend.name" />
      <div class="line-container">
        <div class="line"></div>
        <div class="line"></div>
      </div>
      <div class="line-container1">
        <div class="line"></div>
        <div class="line"></div>
      </div>
    </div>
  </a>
</template>

<script lang="ts" setup>
defineProps<{
  friend: (typeof しまかぜのともだち)[0]
}>()
</script>

<style lang="scss">
$property: transform left right opacity background-color;
$step-1: 500ms;
$step-2: 500ms;
$step-0: 1s;
$bezier: cubic-bezier(0.175, 0.885, 0.32, 1);

@mixin step0 {
  transition-property: $property;
  transition-delay: 0;
  transition-duration: $step-0;
  transition-timing-function: $bezier;
}

@mixin step1 {
  transition-property: $property;
  transition-delay: 0;
  transition-duration: $step-1;
  transition-timing-function: $bezier;
}
@mixin step1-r {
  @include step1;
  transition-delay: 0;
  transition-duration: $step-1;
}

@mixin step2 {
  transition-property: $property;
  transition-delay: $step-1;
  transition-duration: $step-2;
  transition-timing-function: $bezier;
}

@mixin step2-r {
  @include step1;
  transition-delay: 0;
  transition-duration: $step-2;
}

@keyframes spin {
  0% {
    transform: rotate(-90deg);
  }
  100% {
    transform: rotate(270deg);
  }
}

// 此处包含动画信息
.vp-project-card {
  @include step0;
  z-index: 998;
  background-color: var(--vp-c-bg-elv);

  .friend-card-container {
    @include step1-r;
    opacity: 1;
    .friend-logo {
      @include step1-r;
      right: 0;
    }
    .friend-text {
      @include step1-r;
      left: 0;
    }
  }

  .friend-card-hover {
    @include step1-r;
    opacity: 0;
    .friend-hover-logo {
      @include step2-r;
      left: -100%;
    }
    .friend-hover-logo-2 {
      @include step2-r;
      right: -100%;
      opacity: 0;
    }
    .friend-hover-text {
      @include step2-r;
      left: 100%;
    }
    .line-container {
      .line {
        @include step2-r;
        transition-property: right;
        opacity: 0;
        right: calc(-50% - 3px);

        &:nth-child(1) {
          right: calc(-50% + 3px);
        }
      }
    }

    .line-container1 {
      .line {
        @include step2-r;
        right: calc(-50% - 3px);

        &:nth-child(1) {
          right: calc(-50% + 3px);
        }
      }
    }
  }

  &:hover {
    @include step1-r;
    z-index: 999;
    background-color: var(--vp-c-border);

    .friend-card-container {
      @include step1-r;
      .friend-logo {
        @include step1-r;
        right: -100%;
      }
      .friend-text {
        @include step1-r;
        left: -100%;
      }
    }

    .friend-card-hover {
      @include step1;
      opacity: 1;
      width: 16rem;
      transform: scale(2);

      .friend-hover-logo {
        @include step2;
        left: 0;
      }
      .friend-hover-logo-2 {
        @include step2;
        right: 0;
        opacity: 0.25;
      }
      .friend-hover-text {
        @include step2;
        left: 50%;
      }
      .line-container {
        .line {
          @include step2;
          transition-delay: 100ms;
          transition-property: right;
          opacity: 1;
          right: calc(120% - 3px);

          &:nth-child(1) {
            transition-delay: 0ms;
            right: calc(120% + 3px);
          }
        }
      }
      .line-container1 {
        .line {
          @include step2;
          transition-delay: $step-2;
          background-color: var(--vp-c-accent);
          right: calc(140px - 3px);

          &:nth-child(1) {
            transition-delay: $step-2 - 100ms;
            right: calc(140px + 3px);
          }
        }
      }
    }
  }
}

.vp-project-card {
  position: relative;

  .friend-desc {
    color: var(--vp-c-text-mute);
  }

  .friend-card-container {
    overflow: hidden;
    .friend-logo {
      position: relative;
      float: right;
      border-radius: 9999px;
    }
    .friend-text {
      position: relative;
    }
  }

  .friend-card-hover {
    overflow: hidden;
    position: absolute;
    background-color: var(--vp-c-bg-elv);
    border-radius: 0.5rem;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    box-shadow: 0.5rem 0.25rem 0.5rem var(--vp-c-bg);

    .friend-hover-logo {
      filter: brightness(100%) contrast(120%);
      position: absolute;
      height: 80%;
      object-fit: cover;
      border-radius: 9999px;
      margin-left: 1rem;
    }
    .friend-hover-logo-2 {
      z-index: 998;
      position: absolute;
      height: 160px;
      object-fit: cover;
      clip-path: polygon(25% 0, 100% 0, 100% 100%, 0 100%);
    }
    .friend-hover-text {
      filter: brightness(200%) contrast(120%);
      z-index: 999;
      position: absolute;
      top: 10%;
      width: 50%;
      text-align: center;
      font-size: 0.5rem;

      .friend-name {
        font-size: 0.75rem;
        margin-bottom: 0.5rem;
      }

      .friend-desc {
        color: var(--vp-c-text-mute);
      }
    }

    .line-container {
      position: relative;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .line {
        filter: brightness(200%) contrast(120%);
        background-color: var(--vp-c-accent);
        position: absolute;
        width: 1rem;
        top: -50%;
        height: 200%;
        transform: rotate(15deg);
      }
    }

    .line-container1 {
      .line {
        filter: brightness(150%) contrast(120%);
        z-index: 999;
        position: absolute;
        width: 4px;
        top: -50%;
        height: 200%;
        transform: rotate(15deg);
      }
    }
  }

  &:hover {
    .friend-card-hover {
      .friend-hover-logo {
        animation-name: spin;
        animation-duration: 10s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }
    }
  }
}
</style>
