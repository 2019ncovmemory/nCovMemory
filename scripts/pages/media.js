"use strict";

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

function pagesOfMediaCategory(category) {
  const { mediaList, route } = category;
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

exports.pagesOfMediaCategories = async categories => {
  const p = await Promise.all(categories.map(c => pagesOfMediaCategory(c)));
  return p.flat(1);
};
