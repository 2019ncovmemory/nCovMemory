"use strict";

const fs = require("fs").promises;

const manifest = ({ title, shortName, description, icons }) => ({
  background_color: "white",
  categories: ["social", "news"],
  description,
  display: "standalone",
  icons,
  name: title,
  short_name: shortName,
  orientation: "portrait-primary",
  scope: "./",
  theme_color: "#2196f3",
  start_url: "./",
});

exports.genManifest = async ({ name, shortName, description, icons, file }) => {
  await fs.writeFile(
    file,
    JSON.stringify(
      manifest({
        title: name,
        shortName,
        description,
        icons,
      }),
    ),
  );
};
