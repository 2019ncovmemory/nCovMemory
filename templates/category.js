"use strict";

const fs = require("fs").promises;
const path = require("path");
const { pathUsingAlias, PATH_GEN_MEDIA } = require("../scripts/constants");
const { categoryToTitle } = require("../scripts/category");

const TEMPLATE_FILE = path.resolve(__dirname, "./category.md");

exports.templateForMediaCategory = async category => {
  const md = await fs.readFile(TEMPLATE_FILE, "utf-8");
  const title = categoryToTitle(category.name);
  return (
    `---
title: ${JSON.stringify(title)}
pageClass: vuetify-page
---

` +
    md.replace("<!-- REPLACE(title) -->", title) +
    `
<script>
import mediaInfoList from '${pathUsingAlias(PATH_GEN_MEDIA, category.name)}';

export default {
  data: () => ({
    mediaList: mediaInfoList
  })
}
</script>
`
  );
};
