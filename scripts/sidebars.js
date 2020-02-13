"use strict";

const path = require("path");

const { ROUTE_MEDIA_BASE, PATH_GEN_MEDIA } = require("./constants");
const { categoryToSubRoute, categoryToTitle } = require("./category");

const categoryNames = require(path.join(PATH_GEN_MEDIA, "info.json"));

const categories = categoryNames.map(c => {
  const subRoute = categoryToSubRoute(c);
  return {
    name: c,
    title: categoryToTitle(c),
    subRoute,
    route: ROUTE_MEDIA_BASE + subRoute,
  };
});

exports.nav = categories.map(c => ({ text: c.title, link: c.route }));

exports.sidebar = Object.assign(
  {},
  ...categories.map(category => {
    const { route, title } = category;
    const mediaList = require(path.join(
      PATH_GEN_MEDIA,
      category.name,
      "cjs.js",
    )).default;
    return {
      [route]: [
        { title, path: route },
        ...mediaList.map(m => ({
          title: m.media,
          path: route + m.media + "/",
          children: m.articles.map(a => ({
            title: a.info.title,
            path: route + m.media + "/" + a.id,
          })),
        })),
      ],
    };
  }),
  {
    // fallback
    "/": [
      "",
      ...categories.map(c => ({
        title: c.title,
        path: c.route,
      })),
    ],
  },
);
