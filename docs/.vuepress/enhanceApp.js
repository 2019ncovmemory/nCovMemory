import Vuetify from "vuetify/lib";
import "@mdi/font/css/materialdesignicons.css";

import "./styles/normalize.styl";
import "normalize.css";

const vuetify = new Vuetify({});

// https://vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
export default ({ Vue, options }) => {
  // ...apply enhancements to the app
  Vue.use(Vuetify);
  options.vuetify = vuetify;
};
