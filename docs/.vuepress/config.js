const VuetifyLoaderPlugin = require("vuetify-loader/lib/plugin");
const themeConfig = require("./theme-configs/default");
const webpack = require("webpack");
const { webpackAlias, PATH_GEN_SITE_INFO } = require("../../scripts/constants");

const siteInfo = require(PATH_GEN_SITE_INFO);

module.exports = {
  title: siteInfo.name,
  description: siteInfo.description,
  base: process.env.CUSTOM_BASE || "/",
  themeConfig,
  markdown: {
    extendMarkdown: md => {
      md.use(require("markdown-it-include"));
    },
  },
  // https://vuepress.vuejs.org/zh/plugin/option-api.html#chainwebpack
  chainWebpack(config, isServer) {
    for (const lang of ["sass", "scss"]) {
      for (const name of ["modules", "normal"]) {
        const rule = config.module.rule(lang).oneOf(name);
        rule.uses.delete("sass-loader");

        rule
          .use("sass-loader")
          .loader("sass-loader")
          .options({
            implementation: require("sass"),
            sassOptions: {
              fiber: require("fibers"),
              indentedSyntax: lang === "sass",
            },
          });
      }
    }

    config
      .plugin("VuetifyLoaderPlugin")
      .use(VuetifyLoaderPlugin, [{ handleAllVueLoaders: true }]);

    config
      .plugin("EnvironmentPlugin")
      .use(
        new webpack.EnvironmentPlugin([
          "CUSTOM_BASE",
          "CUSTOM_DATA_REPO",
          "CUSTOM_RESOURCE_REPO",
        ]),
      );
  },
  alias: {
    ...webpackAlias,
  },
  head: [...siteInfo.head],
  plugins: [
    [
      // https://vuepress.vuejs.org/plugin/official/plugin-pwa.html#vuepress-plugin-pwa
      "@vuepress/pwa",
      {
        serviceWorker: true,
        updatePopup: {
          message: "发现更新内容",
          buttonText: "立即更新",
        },
      },
    ],
  ],
};
