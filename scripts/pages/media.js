"use strict";

const { templateForMedia } = require("../../templates/media");
const { templateForMediaCategory } = require("../../templates/category");

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
  ]);
}

exports.pagesOfMediaCategories = async categories => {
  const p = await Promise.all(categories.map(c => pagesOfMediaCategory(c)));
  return p.flat(1);
};
