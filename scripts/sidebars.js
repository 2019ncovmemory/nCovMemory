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
