"use strict";

const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");
const toIco = require("to-ico");
const { mkdirp, rimrafChildren } = require("../../lib/path");

function iconFiles(iconsDir, iconList) {
  return iconList
    .map(info => {
      const iconType = info[0];

      const sizeList = info.slice(1);

      if (iconType === "ico") {
        return sizeList.map(size => ({
          path: path.join(iconsDir, "icon-" + size + ".ico"),
          iconType,
          sizeStr: size + "x" + size,
          icoSizes: [size],
          size: [size, size],
          type: "image/ico",
        }));
      }

      return sizeList.map(size => {
        size =
          iconType === "splash"
            ? [size[0] * size[2], size[1] * size[2]]
            : Array.isArray(size)
            ? size.slice(0, 2)
            : [size, size];
        const sizeStr = size.join("x");
        const filename =
          (iconType === "splash" ? "splash-screen" : "icon") +
          "-" +
          sizeStr +
          ".png";
        const filePath = path.join(iconsDir, filename);
        return {
          path: filePath,
          iconType,
          sizeStr,
          size,
          type: "image/png",
        };
      });
    })
    .flat(1);
}

async function loadSvgWithSize(file, size) {
  const { width, height, density } = await sharp(file).metadata();
  return sharp(file, {
    density: (size / Math.max(width, height)) * density,
  });
}

async function svgToIco(originalFile, targetFile, sizes) {
  const { width, height, density } = await sharp(originalFile).metadata();

  const offsetRatio = [1, 6];

  const resizedBuffers = await Promise.all(
    sizes.map(size => {
      const newSize =
        (size * offsetRatio[1]) / (offsetRatio[1] - offsetRatio[0] * 2);
      const offset = (newSize * offsetRatio[0]) / offsetRatio[1];
      return (
        sharp(originalFile, {
          density: (newSize / Math.max(width, height)) * density,
        })
          .extract({
            left: offset,
            top: offset,
            width: size,
            height: size,
          })
          // .resize({
          //   width: size,
          //   height: size,
          //   fit: "contain",
          //   background: "transparent",
          // })
          .toBuffer()
      );
    }),
  );

  return fs.writeFile(targetFile, await toIco(resizedBuffers));
}

async function genIconFile(originalFile, info) {
  if (info.iconType === "ico") {
    await svgToIco(originalFile, info.path, info.icoSizes);
  } else if (info.iconType === "splash") {
    const svgSize = Math.floor(Math.min(...info.size) / 2);
    const svg = await loadSvgWithSize(originalFile, svgSize);
    const [extendX, extendY] = info.size.map(s => (s - svgSize) / 2);
    await svg
      .extend({
        top: Math.floor(extendY),
        bottom: Math.ceil(extendY),
        left: Math.floor(extendX),
        right: Math.ceil(extendX),
        background: "white",
      })
      .png()
      .toFile(info.path);
  } else {
    const svg = await loadSvgWithSize(originalFile, info.size[0]);
    await svg.png().toFile(info.path);
  }
}

exports.genIcons = async ({
  iconsDir,
  iconList,
  originalIcons: { transparent, light },
  getIconPath,
}) => {
  const files = iconFiles(iconsDir, iconList);

  await rimrafChildren(iconsDir);

  await mkdirp(iconsDir);

  await Promise.all(
    files.map(f => genIconFile(f.iconType === "ico" ? transparent : light, f)),
  );

  return files
    .filter(f => f.iconType !== "splash")
    .map(f => ({
      src: getIconPath(f.path),
      sizes: f.sizeStr,
      type: f.type,
    }));
};
