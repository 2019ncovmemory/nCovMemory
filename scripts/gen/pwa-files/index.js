"use strict";

const path = require("path");
const { normalizeSep } = require("../../lib/path");

const { genIcons } = require("./icons");
const { head } = require("./head");
const { genManifest } = require("./manifest");

exports.main = async ({
  name,
  shortName,
  description,
  iconsDir,
  iconList,
  publicDir,
  originalIcons,
}) => {
  const getIconPath = filePath =>
    normalizeSep(path.relative(publicDir, filePath));

  const icons = await genIcons({
    iconsDir,
    iconList,
    originalIcons,
    getIconPath,
  });
  await genManifest({
    name,
    shortName,
    description,
    icons,
    file: path.join(publicDir, "manifest.webmanifest"),
  });

  return { icons, head: head() };
};
