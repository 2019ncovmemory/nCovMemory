<template>
  <v-card style="height: 100%" class="d-flex flex-column">
    <v-card-title>{{ media }}</v-card-title>
    <v-card-text>
      <div class="my-2" v-for="a in articlesToShow" :key="a.id">
        <v-chip outlined label small class="mr-1">
          <v-icon small left>mdi-calendar</v-icon>{{ a.info.date }}
        </v-chip>
        <router-link :to="{ path: media, hash: a.info.title }">{{
          a.info.title
        }}</router-link>
      </div>
    </v-card-text>
    <v-spacer />
    <v-card-actions>
      <v-btn
        text
        color="deep-purple accent-4"
        v-if="notShowAllArticles"
        @click.capture="seeAllArticles"
      >
        查看全部{{ articleCount }}篇文章
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    media: String,
    articles: Array,
  },
  computed: {
    articlesToShow() {
      return this.articles.slice(0, 3);
    },
    latestArticle() {
      return this.articles[0];
    },
    notShowAllArticles() {
      return this.articles.length > 3;
    },
    articleCount() {
      return this.articles.length;
    },
  },
  methods: {
    seeAllArticles() {
      // https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
      this.$router.push(this.media + "/").catch(err => {
        console.log(
          "some harmless error occurs in router.push: " + (err && err.message),
        );
      });
    },
  },
};
</script>
