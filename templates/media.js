"use strict";

const fs = require("fs").promises;
const path = require("path");
const { pathUsingAlias, PATH_GEN_MEDIA } = require("../scripts/constants");

const TEMPLATE_FILE = path.resolve(__dirname, "./media.md");

let md;

exports.templateForMedia = async mediaInfo => {
  if (!md) md = await fs.readFile(TEMPLATE_FILE, "utf-8");

  return (
    `# ${mediaInfo.media}\n\n` +
    md +
    `
<script>
import mediaInfo from '${pathUsingAlias(
      PATH_GEN_MEDIA,
      mediaInfo.category,
      mediaInfo.media,
    )}';

export default {
data: () => mediaInfo
}
</script>
`
  );
};
