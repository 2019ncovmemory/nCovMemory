"use strict";

const { ROUTE_MEDIA_BASE } = require("../constants");
const { main: gen } = require("../gen");

const { pagesOfMediaCategories } = require("./media");
const { pagesOfHomepage } = require("./homepage");

exports.additionalPagesAndData = async () => {
  const data = await gen();
  const {
    siteInfo: { title, description, defaultLink },
    homepageContent,
    mediaCategories,
  } = data;
  const [mediaPages, homePages] = await Promise.all([
    pagesOfMediaCategories(mediaCategories),
    pagesOfHomepage({
      route: ROUTE_MEDIA_BASE,
      content: homepageContent,
      title,
      description,
      defaultLink,
    }),
  ]);

  return {
    ...data,
    pages: [...mediaPages, ...homePages],
  };
};
