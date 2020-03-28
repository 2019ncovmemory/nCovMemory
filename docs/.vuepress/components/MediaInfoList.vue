<template>
  <v-container fluid>
    <v-row>
      <v-col
        v-for="media in mediaList"
        :key="media.media"
        cols="12"
        sm="12"
        md="6"
        lg="4"
        xl="3"
      >
        <!-- class="flex-grow-1" -->
        <media-info v-bind="media" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    mediaList: Array
  }
};
</script>

<style></style>
