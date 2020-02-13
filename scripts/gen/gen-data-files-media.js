"use strict";

const { mkdirp } = require("../lib/path");
const fs = require("fs").promises;
const path = require("path");

async function genDataFileForMediaHome(mediaInfoList, dir) {
  await mkdirp(dir);

  const toExport =
    "[" + mediaInfoList.map((_, i) => `media${i}`).join(", ") + "]";

  await Promise.all([
    fs.writeFile(
      path.join(dir, "index.js"),
      mediaInfoList
        .map((m, i) => `import media${i} from "./${m.media}"`)
        .join("\n") +
        "\nexport default " +
        toExport,
    ),
    fs.writeFile(
      path.join(dir, "cjs.js"),
      mediaInfoList
        .map((m, i) => `const media${i} = require("./${m.media}/cjs").default`)
        .join("\n") +
        "\nexports.default = " +
        toExport,
    ),
  ]);
}

function genDataFilesForMediaList(mediaList, dir) {
  return Promise.all([
    // mediaInfoList => media-home
    genDataFileForMediaHome(mediaList, dir),
    // each mediaInfo
    ...mediaList.map(async mediaInfo => {
      const mediaDir = path.join(dir, mediaInfo.media);
      await mkdirp(mediaDir);
      const indexJsExports = `
{
  media: ${JSON.stringify(mediaInfo.media)},
  articles: [${mediaInfo.articles.map((_, i) => `a${i}`).join(", ")}]
}
`;
      await Promise.all([
        ...mediaInfo.articles.map(article =>
          fs.writeFile(
            path.join(mediaDir, article.id + ".json"),
            JSON.stringify(article),
          ),
        ),
        fs.writeFile(
          path.join(mediaDir, "index.js"),
          mediaInfo.articles
            .map((a, i) => `import a${i} from "./${a.id}.json"`)
            .join("\n") +
            "\nexport default " +
            indexJsExports,
        ),
        fs.writeFile(
          path.join(mediaDir, "cjs.js"),
          mediaInfo.articles
            .map((a, i) => `const a${i} = require("./${a.id}.json")`)
            .join("\n") +
            "\nexports.default = " +
            indexJsExports,
        ),
      ]);
    }),
  ]);
}

exports.genDataFilesForMediaCategories = async (
  mediaInfoListByCategory,
  dir,
) => {
  const content = JSON.stringify(Object.keys(mediaInfoListByCategory));

  await Promise.all([
    fs.writeFile(path.join(dir, "info.json"), content),
    ...Object.keys(mediaInfoListByCategory).map(category =>
      genDataFilesForMediaList(
        mediaInfoListByCategory[category],
        path.join(dir, category),
      ),
    ),
  ]);
};
