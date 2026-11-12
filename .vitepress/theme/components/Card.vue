<template>
  <div class="card">
    <slot />
  </div>
</template>

<style scoped>
.card {
  position: relative;
  margin: 0 auto 10px;
  padding: 10px;
  width: 100%;
  overflow: hidden;
  border-radius: 0.25rem;
  box-shadow: var(--box-shadow);
  box-sizing: border-box;
  transition: all 0.3s;
  background-color: rgba(var(--bg-gradient));
  display: flex;
  flex-direction: column;
}
.card:hover {
  box-shadow: var(--box-shadow-hover);
}
</style>
