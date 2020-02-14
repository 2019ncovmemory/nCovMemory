"use strict";

const regexps = require("../lib/regexps");
const { SITE_SHORT_NAME } = require("../constants");

exports.extractHomepageAndSiteInfo = ({ originalMd, mediaCategories }) => {
  const resList = regexps.mdMatchAllHeaders(originalMd);
  let home = "";
  let curIndex = 0;
  let update = str => (home += str);

  const info = {};

  for (const res of resList.filter(res => res.groups.tag.length <= 2)) {
    if (typeof update === "function") {
      update(originalMd.slice(curIndex, res.index));
      curIndex = res.index;
    }

    if (res.groups.tag.length === 2) {
      const category = mediaCategories.find(c => c.title === res.groups.inline);
      if (category !== undefined) {
        const { mediaList, route } = category;
        if (!info.defaultLink) info.defaultLink = route;
        update = () => {
          home +=
            res.raw +
            `

[查看 ${mediaList.length} 家媒体的 ${mediaList.reduce(
              (n, m) => n + m.articles.length,
              0,
            )} 篇文章](${route})
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

  info.appName = info.title.split(/[：:]/)[0];
  info.shortName = SITE_SHORT_NAME;

  return { content: home, info };
};
