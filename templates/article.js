"use strict";

const fs = require("fs").promises;
const path = require("path");
const { pathUsingAlias, PATH_GEN_MEDIA } = require("../scripts/constants");

const TEMPLATE_FILE = path.resolve(__dirname, "./article.md");

let md;

exports.templateForArticle = async articleInfo => {
  if (!md) md = await fs.readFile(TEMPLATE_FILE, "utf-8");

  return (
    `---
title: ${JSON.stringify(articleInfo.info.title)}
---

` +
    md +
    `
<script>
import { articles } from '${pathUsingAlias(
      PATH_GEN_MEDIA,
      articleInfo.info.category,
      articleInfo.info.media,
    )}';

const articleInfo = articles[${JSON.stringify(articleInfo.id)}]

export default {
  data: () => articleInfo
}
</script>
`
  );
};
