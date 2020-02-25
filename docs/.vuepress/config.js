/* eslint-env node */

const VuetifyLoaderPlugin = require("vuetify-loader/lib/plugin");
const webpack = require("webpack");
const { webpackAlias } = require("../../scripts/constants");
const { additionalPagesAndData } = require("../../scripts/pages");

const data = additionalPagesAndData();

module.exports = async () => {
  const { pages, siteInfo, head, nav, sidebar } = await data;
  return {
    title: siteInfo.appName,
    description: siteInfo.description,
    base: process.env.CUSTOM_BASE || "/",
    // https://vuepress.vuejs.org/theme/default-theme-config.html
    themeConfig: { nav, sidebar },
    additionalPages: pages,
    markdown: {
      extendMarkdown: md => {
        md.use(require("markdown-it-include"));
      },
    },
    // https://vuepress.vuejs.org/zh/plugin/option-api.html#chainwebpack
    chainWebpack(config) {
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
    head,
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
          generateSWConfig: {
            importWorkboxFrom: "local",
          },
        },
      ],
      [
        "named-chunks",
        {
          pageChunkName: page => "page" + page.key.slice(1),
          layoutChunkName: layout => "layout-" + layout.componentName,
        },
      ],
    ],
  };
};
