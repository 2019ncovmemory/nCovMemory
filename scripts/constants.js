"use strict";

const path = require("path");
const { normalizeSep } = require("./lib/path");

exports.SITE_SHORT_NAME = "nCov记忆";

exports.DATA_REPO = process.env.CUSTOM_DATA_REPO || "2019ncovmemory/nCovMemory";

exports.PATH_GEN_BASE = path.join(__dirname, "../gen/");
exports.PATH_GEN_MEDIA = path.join(this.PATH_GEN_BASE, "data/media/");

exports.PATH_DATA_CSV = path.join(this.PATH_GEN_BASE, "data.csv");
exports.PATH_README = path.join(this.PATH_GEN_BASE, "README.handlebars");
exports.PATH_ORDERING_JSON = path.join(this.PATH_GEN_BASE, "ordering.json");

exports.ROUTE_MEDIA_BASE = "/";

exports.PATH_DOCS = "./docs";
exports.PATH_PUBLIC = "./docs/.vuepress/public";
exports.PATH_ICONS = path.join(this.PATH_PUBLIC, "icons");
exports.PATH_ORIGINAL_ICONS = {
  transparent: path.join(this.PATH_PUBLIC, "icon.svg"),
  light: path.join(this.PATH_PUBLIC, "icon-light.svg"),
};

exports.DEV_MEDIA_MAX_COUNT = process.env.DEV_MEDIA_MAX_COUNT
  ? Number.parseInt(process.env.DEV_MEDIA_MAX_COUNT, 10) || 2
  : 0;

exports.webpackAlias = {
  "@gen": this.PATH_GEN_BASE,
};
exports.pathUsingAlias = (p, ...ps) => {
  return normalizeSep(
    path.join("@gen", path.relative(this.PATH_GEN_BASE, p), ...ps),
  );
};
