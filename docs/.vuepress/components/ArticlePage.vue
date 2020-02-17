<template>
  <div>
    <h1 class="mb-6">{{ info.title }}</h1>

    <article-actions class="mb-6" />

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
import { getArticleImgSrc } from "../constants";

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
      return getArticleImgSrc(this.info.id);
    },
  },
};
</script>
