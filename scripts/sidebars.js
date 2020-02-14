"use strict";

exports.getNav = categories =>
  categories.map(c => ({ text: c.title, link: c.route }));

exports.getSidebar = categories =>
  Object.assign(
    {},
    ...categories.map(category => {
      const { route, title, mediaList } = category;
      return {
        [route]: [
          { title, path: route },
          ...mediaList.map(m => ({
            title: m.media,
            path: route + m.media + "/",
            children: m.articles.map(a => ({
              title: a.info.title,
              path: route + m.media + "/" + a.id + "/",
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
