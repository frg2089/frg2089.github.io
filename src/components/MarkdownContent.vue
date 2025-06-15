<template>
  <HopeMarkdownContent v-bind="$attrs" data-clarity-region="article">
    <template #contentBefore>
      <slot name="contentBefore" />
    </template>
    <template #contentAfter>
      <slot name="contentAfter" />
    </template>
  </HopeMarkdownContent>
</template>

<script lang="ts" setup>
import HopeMarkdownContent from 'vuepress-theme-hope/components/base/MarkdownContent'
</script>
