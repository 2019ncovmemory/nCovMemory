"use strict";

const regexps = require("../lib/regexps");
const { SITE_SHORT_NAME } = require("../constants");

// remove first 5 non-empty line in README
const REMOVE_LINE_COUNT = 5;
const DESC_LINE_NUM = 2;

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

    if (res.groups.tag.length === 2 && res.groups.inline.trim() === "目录") {
      update = () => (home += res.raw + "\n\n[[toc]]\n");
    } else if (res.groups.tag.length === 1) {
      if (info.title) console.warn("detected multiple h1 in README");
      else info.title = res.groups.inline;
      // h1
      update = str => {
        const count = REMOVE_LINE_COUNT;
        const matches = [...str.matchAll(/^.+$/gm)].slice(0, count + 1);
        const removedLines = matches.slice(0, count).map(m => m[0]);
        const rest = str.slice(matches[count].index);

        info.description = removedLines[DESC_LINE_NUM];

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
  info.appShortName = SITE_SHORT_NAME;
  info.defaultLink = mediaCategories[0].route;

  home = home.replace(
    /{{!-- category --}}.+{{\/each}}/s,
    mediaCategories
      .map(
        c =>
          `## ${c.title}

[查看 ${c.mediaList.length} 家媒体的 ${c.mediaList.reduce(
            (n, m) => n + m.articles.length,
            0,
          )} 篇文章](${c.route})
    `,
      )
      .join("\n"),
  );

  return { content: home, info };
};
