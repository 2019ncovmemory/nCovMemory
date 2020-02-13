<template>
  <div>
    <h1 class="mb-6">{{ info.title }}</h1>

    <div class="mb-6">
      <v-chip outlined label>
        <v-icon small left>mdi-calendar</v-icon>{{ info.date }}
        <div class="mx-2 vline" style="height: 100%" />
        <span class="vline-l">{{ info.media }}</span>
      </v-chip>

      <v-chip outlined label :href="info.url" target="_blank">
        查看原文
        <v-icon small right>mdi-open-in-new</v-icon>
      </v-chip>

      <v-chip outlined label :href="info.archive" target="_blank">
        archive
        <v-icon small right>mdi-open-in-new</v-icon>
      </v-chip>

      <v-chip outlined label :href="this.imgSrc" target="_blank">
        截图
        <v-icon small right>mdi-open-in-new</v-icon>
      </v-chip>
    </div>

    <v-container>
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn v-if="!showImg" @click="showImg = true">显示截图</v-btn>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col>
          <v-img v-if="showImg" :src="imgSrc">
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { RESOURCE_REPO } from "../constants";

export default {
  props: {
    info: Object,
    id: String,
    orderInDate: Number,
  },
  data: () => ({
    showImg: false,
  }),
  computed: {
    imgSrc() {
      return `https://github.com/${RESOURCE_REPO}/raw/master/archive/jpg/${this.info.id}.jpg`;
    },
  },
};
</script>

<style lang="sass" scoped>
.vline
  height: 100%
  border-left: thin solid #e0e0e0
</style>
