"use strict";

const { extractHomepageAndSiteInfo } = require("./extract-site-info");
const {
  extractMediaCategoriesFromData,
} = require("./extract-media-categories");
const { genDataFilesForCategories } = require("./gen-data-files-media");
const { categoryToTitle, categoryToSubRoute } = require("../category");
const { prepare } = require("./prepare");
const { main: genPwaFiles } = require("./pwa-files");
const { iconList } = require("../icon-list");

const fs = require("fs").promises;

const {
  DEV_MEDIA_MAX_COUNT,
  PATH_PUBLIC,
  PATH_ICONS,
  PATH_ORIGINAL_ICONS,
  PATH_GEN_MEDIA,
  PATH_README,
  PATH_DATA_CSV,
  PATH_ORDERING_JSON,
  ROUTE_MEDIA_BASE,
} = require("../constants");

async function main() {
  await prepare(!!DEV_MEDIA_MAX_COUNT);

  const [mediaCategories, homepageOriginalMd] = await Promise.all([
    extractMediaCategoriesFromData({
      dataCsv: PATH_DATA_CSV,
      orderingJson: PATH_ORDERING_JSON,
      categoryNameToTitle: categoryToTitle,
      categoryNameToSubRoute: categoryToSubRoute,
      mediaBaseRoute: ROUTE_MEDIA_BASE,
      DEV_MEDIA_MAX_COUNT,
    }),
    fs.readFile(PATH_README, "utf-8"),
  ]);
  const {
    content: homepageContent,
    info,
    info: { description, appShortName, appName },
  } = extractHomepageAndSiteInfo({
    originalMd: homepageOriginalMd,
    mediaCategories,
  });

  const [{ head }] = await Promise.all([
    genPwaFiles({
      name: appName,
      shortName: appShortName,
      description,
      publicDir: PATH_PUBLIC,
      originalIcons: PATH_ORIGINAL_ICONS,
      iconsDir: PATH_ICONS,
      iconList,
    }),
    genDataFilesForCategories({
      categories: mediaCategories,
      dir: PATH_GEN_MEDIA,
    }),
  ]);

  return {
    siteInfo: info,
    head,
    homepageContent,
    mediaCategories,
  };
}

exports.main = main;
