<template>
  <div class="blog-info" data-pagefind-ignore="all">
    <!-- 统计数据，日后支持，点击筛选出左侧的数据 -->
    <BlogHomeOverview />

    <Card>
      <ClientOnly>
        <CalendarCard />
      </ClientOnly>
    </Card>

    <!-- 置顶的一些文章 -->
    <BlogHotArticle />

    <!-- 友链 -->
    <BlogFriendLink />

    <!-- 标签 -->
    <BlogHomeTags />
  </div>
</template>

<script lang="ts" setup>
import BlogFriendLink from '@sugarat/theme/components/BlogFriendLink.vue'
import BlogHomeOverview from '@sugarat/theme/components/BlogHomeOverview.vue'
import BlogHomeTags from '@sugarat/theme/components/BlogHomeTags.vue'
import BlogHotArticle from '@sugarat/theme/components/BlogHotArticle.vue'

import CalendarCard from './CalendarCard.vue'
import Card from './Card.vue'
</script>

<style scoped>
.blog-info {
  display: flex;
  flex-direction: column;
  min-width: 240px;
  position: relative;
  box-sizing: border-box;
}

@media screen and (min-width: 767px) {
  .blog-info {
    width: 280px;
  }
}
</style>
