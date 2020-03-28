"use strict";

const fs = require("fs").promises;
const path = require("path");
const { pathUsingAlias, PATH_GEN_MEDIA } = require("../scripts/constants");

const TEMPLATE_FILE = path.resolve(__dirname, "./media.md");

let md;

exports.templateForMedia = async mediaInfo => {
  if (!md) md = await fs.readFile(TEMPLATE_FILE, "utf-8");

  return (
    md.replace(
      "<!-- REPLACE CONTENT -->",
      `# ${mediaInfo.media}\n` +
        mediaInfo.articles
          .map(
            a => `
## ${a.info.title}

<client-only-wrapper style="min-height: 32px">
  <article-actions :article="articles['${a.id}']" hide-media-name />
</client-only-wrapper>
`,
          )
          .join("\n"),
    ) +
    `
<script>
import { articles } from '${pathUsingAlias(
      PATH_GEN_MEDIA,
      mediaInfo.category,
      mediaInfo.media,
    )}';

export default {
  data: () => ({ articles }),
}
</script>
`
  );
};
