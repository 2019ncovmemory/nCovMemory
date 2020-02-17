<template>
  <div class="mb-6">
    <v-chip outlined label>
      <v-icon small left>mdi-calendar</v-icon>{{ article.info.date }}
      <template v-if="!hideMediaName">
        <div class="mx-2 vline" style="height: 100%" />
        <span>{{ article.info.media }}</span>
      </template>
    </v-chip>

    <v-chip outlined label :href="article.info.url" target="_blank">
      查看原文
      <v-icon small right>mdi-open-in-new</v-icon>
    </v-chip>

    <v-chip outlined label :href="article.info.archive" target="_blank">
      archive
      <v-icon small right>mdi-open-in-new</v-icon>
    </v-chip>

    <v-chip outlined label :href="imgSrc" target="_blank" v-if="imgSrc">
      截图
      <v-icon small right>mdi-open-in-new</v-icon>
    </v-chip>
  </div>
</template>

<script>
import { getArticleImgSrc } from "../constants";

export default {
  props: {
    article: Object,
    hideMediaName: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    imgSrc() {
      return getArticleImgSrc(this.article);
    },
  },
};
</script>

<style lang="sass" scoped>
.vline
  height: 100%
  border-left: thin solid #e0e0e0
</style>
