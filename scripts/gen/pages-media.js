"use strict";

const { mkdirp, rimrafChildren } = require("../lib/path");

const { extractMediaCategoriesFromData } = require("./extract-media-articles");
const { genDataFilesForMediaCategories } = require("./gen-data-files-media");
const { templateForMedia } = require("../../templates/media");
const { templateForMediaCategory } = require("../../templates/category");
const { templateForArticle } = require("../../templates/article");

async function pagesOfArticle(article, route) {
  const md = await templateForArticle(article);
  return {
    path: route + `${article.id}/`,
    content: md,
  };
}

function pagesOfMediaCategory(category, route) {
  const { mediaList } = category;
  return Promise.all([
    templateForMediaCategory(category).then(mediaHomeContent => ({
      path: route,
      content: mediaHomeContent,
    })),
    ...mediaList.map(async mediaInfo => ({
      path: route + mediaInfo.media + "/",
      content: await templateForMedia(mediaInfo),
    })),
    ...mediaList
      .map(m => m.articles.map(a => pagesOfArticle(a, route + m.media + "/")))
      .flat(1),
  ]);
}

async function pages(mediaByCategory, route, categoryToSubRoute) {
  const p = await Promise.all(
    Object.keys(mediaByCategory).map(c =>
      pagesOfMediaCategory(
        { name: c, mediaList: mediaByCategory[c] },
        route + categoryToSubRoute(c),
      ),
    ),
  );
  return p.flat(1);
}

exports.pagesOfMediaCategories = async ({
  baseRoute,
  dataCsv,
  orderingJson,
  genMediaDataDir,
  categoryToSubRoute,
}) => {
  const [mediaByCategory] = await Promise.all([
    await extractMediaCategoriesFromData({ dataCsv, orderingJson }),
    await rimrafChildren(genMediaDataDir).then(() => mkdirp(genMediaDataDir)),
  ]);

  const [res] = await Promise.all([
    pages(mediaByCategory, baseRoute, categoryToSubRoute),
    genDataFilesForMediaCategories(mediaByCategory, genMediaDataDir),
  ]);

  return { pages: res, mediaByCategory };
};
