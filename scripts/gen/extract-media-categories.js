"use strict";

const fs = require("fs").promises;
const Papa = require("papaparse");
const { hash } = require("../lib/hash");

async function getArticles(dataFile) {
  const csv = await fs.readFile(dataFile, "utf-8");

  const { data } = Papa.parse(csv, {
    header: true,
    transformHeader: h => {
      h = h.trim();
      return h === "is_deleted" ? "isDeleted" : h;
    },
    transform: (v, h) => {
      v = v.trim();
      return h === "isDeleted"
        ? v === "true" || v === "TRUE"
          ? true
          : false
        : v;
    },
  });

  return data;
}

async function getOrdering(file) {
  const content = await fs.readFile(file, "utf-8");
  return JSON.parse(content);
}

exports.extractMediaCategoriesFromData = async ({
  dataCsv,
  orderingJson,
  categoryNameToTitle,
  categoryNameToSubRoute,
  mediaBaseRoute,
  DEV_MEDIA_MAX_COUNT,
}) => {
  const [articles, ordering] = await Promise.all([
    getArticles(dataCsv),
    getOrdering(orderingJson),
  ]);

  const articlesByCategoryMediaDate = {};

  for (const article of articles.reverse()) {
    const { date, media, title } = article;
    if (!title) {
      console.warn(
        "The title of an article is not specified and it will be skipped.",
      );
      continue;
    }

    let { category } = article;

    if (!category) {
      console.warn(
        `category of ${media}/${date}/${title} not specified in data.csv, using "non_fiction" as default`,
      );

      category = "non_fiction";
    }

    const mediaCategory =
      articlesByCategoryMediaDate[category] ||
      (articlesByCategoryMediaDate[category] = {});
    const mediaInfo = mediaCategory[media] || (mediaCategory[media] = {});
    const dateInfo = mediaInfo[date] || (mediaInfo[date] = []);

    dateInfo.push(article);
  }

  const categories = {};

  const usedArticleIds = {};

  for (const categoryName of Object.keys(articlesByCategoryMediaDate)) {
    const articlesByMediaDate = articlesByCategoryMediaDate[categoryName];

    const mediaInfoList = [];

    for (const mediaName of Object.keys(articlesByMediaDate).sort()) {
      const articlesByDate = articlesByMediaDate[mediaName];

      const articlesOfMedia = [];

      for (const date of Object.keys(articlesByDate)) {
        articlesOfMedia.push(
          ...articlesByDate[date].map((v, i) => {
            const name =
              v.category + "/" + v.media + "/" + date + "/" + v.title;
            const id = hash(name);

            if (usedArticleIds[id]) {
              console.warn(`article duplicate: ${name}`);
            } else {
              usedArticleIds[id] = true;
            }

            return {
              info: v,
              orderInDate: i,
              filename: id,
              id,
            };
          }),
        );
      }

      mediaInfoList.push({
        media: mediaName,
        category: categoryName,
        // sort by [info.date, orderInDate] desc
        articles: articlesOfMedia.reverse(),
      });
    }

    const orderedMedia = ordering[categoryName];

    let indices;

    if (orderedMedia) {
      indices = orderedMedia.reduce((obj, v, i) => {
        if (obj[v] !== undefined) {
          console.warn(
            `${categoryName}.${v} listed multiple times in ordering.json`,
          );
        }
        return { ...obj, [v]: i };
      }, {});
    } else {
      indices = undefined;
      console.warn(`category ${categoryName} not included in ordering.json`);
    }

    categories[categoryName] = indices
      ? mediaInfoList.sort((m1, m2) => {
          for (const m of [m1, m2]) {
            if (indices[m.media] === undefined) {
              console.warn(
                `${categoryName}.${m.media} not listed in ordering.json`,
              );
              indices[m.media] = -1;
            }
          }

          const i1 = indices[m1.media];
          const i2 = indices[m2.media];

          return i1 - i2;
        })
      : mediaInfoList.sort((m1, m2) => (m1.media > m2.media1 ? 1 : -1));
  }

  let categoriesResult = categories;

  if (DEV_MEDIA_MAX_COUNT > 0) {
    console.warn(
      `media count in each category is limited to ${DEV_MEDIA_MAX_COUNT} for quicker development`,
    );
    categoriesResult = Object.assign(
      {},
      ...Object.keys(categories).map(c => ({
        [c]: categories[c].slice(0, DEV_MEDIA_MAX_COUNT),
      })),
    );
  }

  return Object.keys(categoriesResult).map(c => {
    const subRoute = categoryNameToSubRoute(c);
    return {
      name: c,
      mediaList: categoriesResult[c],
      title: categoryNameToTitle(c),
      subRoute,
      route: mediaBaseRoute + subRoute,
    };
  });
};
