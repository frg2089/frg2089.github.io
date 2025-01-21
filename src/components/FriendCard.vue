<template>
  <a class="vp-project-card" :href="friend.link" :title="friend.name">
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
      <div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
      <div class="friend-hover-text">
        <div class="friend-name" v-text="friend.name" />
        <div class="friend-desc" v-text="friend.desc" />
      </div>
      <img class="friend-hover-logo-2" :src="friend.icon" :alt="friend.name" />
    </div>
  </a>
</template>

<script lang="ts" setup>
defineProps<{
  friend: (typeof しまかぜのともだち)[0]
}>()
</script>

<style lang="scss">
.vp-project-card {
  z-index: 998;
  width: calc(33% - 40px);
  position: relative;
  background-color: var(--vp-c-bg-elv);
  &:nth-child(3n + 1) {
    transform-origin: 0 0;
  }
  &:nth-child(3n + 2) {
    transform-origin: 50% 0;
  }
  &:nth-child(3n + 3) {
    transform-origin: 100% 0;
  }
  &:nth-last-child(3) {
    transform-origin: 0 100%;
  }
  &:nth-last-child(2) {
    transform-origin: 50% 100%;
  }
  &:nth-last-child(1) {
    transform-origin: 100% 100%;
  }

  * {
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1);
  }

  .friend-desc {
    color: var(--vp-c-text-mute);
  }

  .friend-card-container {
    overflow: hidden;
    .friend-logo {
      position: relative;
      float: right;
      border-radius: 9999px;
      right: 0;
    }
    .friend-text {
      position: relative;
      left: 0;
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

    opacity: 0;
    .friend-hover-logo {
      position: absolute;
      left: -100%;
      height: 80%;
      object-fit: cover;
      border-radius: 9999px;
      margin-left: 0.5rem;
    }
    .friend-hover-logo-2 {
      z-index: 998;
      position: absolute;
      right: -100%;
      height: 160px;
      object-fit: cover;
      opacity: 0;
      clip-path: polygon(25% 0, 100% 0, 100% 100%, 0 100%);
    }
    .friend-hover-text {
      z-index: 999;
      position: absolute;
      left: 50%;
      width: 50%;
      top: 80%;
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

    .line {
      z-index: 999;
      position: absolute;
      width: 4px;
      background-color: rgba(0, 0, 0, 0);
      top: -50%;
      right: calc(-50% - 3px);
      height: 200%;
      transform: rotate(15deg);

      &:nth-child(1) {
        right: calc(-50% + 3px);
      }
    }
  }

  &:hover {
    z-index: 999;
    transform: scale(2);

    .friend-card-container {
      .friend-logo {
        right: -100%;
      }
      .friend-text {
        left: -100%;
      }
    }

    .friend-card-hover {
      opacity: 1;

      .friend-hover-logo {
        left: 0;
      }
      .friend-hover-logo-2 {
        right: 0;
        opacity: 0.25;
      }
      .friend-hover-text {
        top: 10%;
      }
      .line {
        background-color: var(--vp-c-accent);
        right: calc(140px - 3px);

        &:nth-child(1) {
          right: calc(140px + 3px);
        }
      }
    }
  }
}
</style>
