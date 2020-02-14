"use strict";

const { mkdirp } = require("../lib/path");
const fs = require("fs").promises;
const path = require("path");
const { rimrafChildren } = require("../lib/path");

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

function genDataFilesForCategory(category, dir) {
  const { mediaList } = category;
  return Promise.all([
    // mediaInfoList => media-home
    genDataFileForMediaHome(mediaList, dir),
    // each mediaInfo
    ...mediaList.map(async mediaInfo => {
      const mediaDir = path.join(dir, mediaInfo.media);
      await mkdirp(mediaDir);
      const defs = mediaInfo.articles
        .map((a, i) => `const a${i} = ${JSON.stringify(a)};`)
        .join("\n");
      const articlesObject = `articles = {
${mediaInfo.articles
  .map((a, i) => `  ${JSON.stringify(a.id)}: a${i},`)
  .join("\n")}
}
`;
      const indexJsExports = `{
  media: ${JSON.stringify(mediaInfo.media)},
  articles: [${mediaInfo.articles.map((_, i) => `a${i}`).join(", ")}]
}
`;
      await Promise.all([
        // ...mediaInfo.articles.map(article =>
        //   fs.writeFile(
        //     path.join(mediaDir, article.id + ".json"),
        //     JSON.stringify(article),
        //   ),
        // ),
        fs.writeFile(
          path.join(mediaDir, "index.js"),
          defs +
            "\n" +
            `export const ${articlesObject};\n` +
            "export default " +
            indexJsExports,
        ),
        fs.writeFile(
          path.join(mediaDir, "cjs.js"),
          defs +
            "\n" +
            `exports.${articlesObject};\n` +
            "exports.default = " +
            indexJsExports,
        ),
      ]);
    }),
  ]);
}

exports.genDataFilesForCategories = async ({ categories, dir }) => {
  await rimrafChildren(dir);
  const content = JSON.stringify(categories.map(c => c.name));

  await Promise.all([
    fs.writeFile(path.join(dir, "info.json"), content),
    ...categories.map(category =>
      genDataFilesForCategory(category, path.join(dir, category.name)),
    ),
  ]);
};
