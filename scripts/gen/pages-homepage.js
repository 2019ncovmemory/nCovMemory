"use strict";

const fs = require("fs").promises;
const regexps = require("../lib/regexps");
const { categoryTitleToName, categoryToSubRoute } = require("../category");

const prependHome = ({ title, description, link }) => `---
home: true
heroText: ${title}
tagline: ${description}
actionText: 开始阅读
actionLink: ${link}
# features:
#   - title: Simplicity First
#     details: Minimal setup with markdown-centered project structure helps you focus on writing.
#   - title: Vue-Powered
#     details: Enjoy the dev experience of Vue + webpack, use Vue components in markdown, and develop custom themes with Vue.
#   - title: Performant
#     details: VuePress generates pre-rendered static HTML for each page, and runs as an SPA once a page is loaded.
# footer: MIT Licensed | Copyright © 2018-present Evan You
---

`;

function homepageReadme(originalMd, mediaByCategory, route) {
  const resList = regexps.mdMatchAllHeaders(originalMd);
  let home = "";
  let curIndex = 0;
  let update = str => (home += str);

  let info = {};

  for (const res of resList.filter(res => res.groups.tag.length <= 2)) {
    if (typeof update === "function") {
      update(originalMd.slice(curIndex, res.index));
      curIndex = res.index;
    }

    if (res.groups.tag.length === 2) {
      const categoryName = categoryTitleToName(res.groups.inline);
      const mediaList = mediaByCategory[categoryName];
      if (categoryName !== undefined) {
        const r = route + categoryToSubRoute(categoryName);
        if (!info.link) info.link = r;
        update = () => {
          home +=
            res.raw +
            `

[查看 ${mediaList.length} 家媒体的 ${mediaList.reduce(
              (n, m) => n + m.articles.length,
              0,
            )} 篇文章](${r})
`;
        };
      } else if (res.groups.inline.trim() === "目录") {
        update = () => (home += res.raw + "\n\n[[toc]]\n");
      } else {
        update = undefined;
      }
    } else if (res.groups.tag.length === 1) {
      if (info.title) console.warn("detected multiple h1 in README");
      else info.title = res.groups.inline;
      // h1
      update = str => {
        // remove first 4 non-empty line in README
        const count = 4;
        const matches = [...str.matchAll(/^.+$/gm)].slice(0, count + 1);
        const removedLines = matches.slice(0, count).map(m => m[0]);
        const rest = str.slice(matches[count].index);

        info.description = removedLines[1];

        home += rest;
      };
    } else {
      update = undefined;
    }
    if (update === undefined) {
      update = str => (home += str);
    }
  }

  if (typeof update === "function") {
    update(originalMd.slice(curIndex));
  }

  return { content: prependHome(info) + home, info };
}

exports.pagesOfHomepage = async ({
  originalFile,
  mediaByCategory,
  baseRoute,
}) => {
  const md = await fs.readFile(originalFile, "utf-8");

  let { content, info } = homepageReadme(md, mediaByCategory, baseRoute);

  return {
    pages: [{ path: baseRoute, content }],
    info,
  };
};
