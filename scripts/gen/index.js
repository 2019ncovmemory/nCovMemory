"use strict";

const { additionalPages } = require("./additional-pages");
const fs = require("fs").promises;
const path = require("path");
const { mkdirp, rimrafChildren } = require("../lib/path");
const {
  PATH_DOCS,
  DEV_MEDIA_MAX_COUNT,
  PATH_PUBLIC,
  PATH_ICONS,
  PATH_ORIGINAL_ICONS,
  PATH_GEN_SITE_INFO,
} = require("../constants");

const { prepare } = require("./prepare");
const { main: genPwaFiles } = require("./pwa-files");
const { iconList } = require("../icon-list");

async function main() {
  await prepare(!!DEV_MEDIA_MAX_COUNT);

  const { pages, title, description, shortName } = await additionalPages();
  const name = title.split(/[：:]/)[0];

  await Promise.all(
    [
      ...new Set(pages.map(p => p.path.split("/")[1]).filter(Boolean)).values(),
    ].map(subDir => rimrafChildren(path.join(PATH_DOCS, subDir))),
  );

  const ensuredDirs = {};

  await Promise.all([
    (async () => {
      const { head } = await genPwaFiles({
        name,
        shortName,
        description,
        publicDir: PATH_PUBLIC,
        originalIcons: PATH_ORIGINAL_ICONS,
        iconsDir: PATH_ICONS,
        iconList,
      });
      await fs.writeFile(
        PATH_GEN_SITE_INFO,
        JSON.stringify({
          title,
          name,
          shortName,
          description,
          head,
        }),
      );
    })(),
    ...pages.map(async p => {
      const isLeaf =
        pages.findIndex(
          page => page.path.startsWith(p.path) && page.path !== p.path,
        ) === -1;

      const dir = path.join(
        PATH_DOCS,
        isLeaf ? path.join(p.path, "../") : p.path,
      );

      if (!ensuredDirs[dir]) {
        ensuredDirs[dir] = mkdirp(dir);
      }
      await ensuredDirs[dir];

      const file = isLeaf
        ? path.join(PATH_DOCS, p.path.slice(0, -1) + ".md")
        : path.join(dir, "README.md");
      await fs.writeFile(file, p.content);
    }),
  ]);
}

exports.main = main;
