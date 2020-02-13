"use strict";

const {
  ROUTE_MEDIA_BASE,
  PATH_DATA_CSV,
  PATH_ORDERING_JSON,
  PATH_GEN_MEDIA,
  PATH_README,
  SITE_SHORT_NAME,
} = require("../constants");
const { categoryToSubRoute } = require("../category");

const { pagesOfMediaCategories } = require("./pages-media");
const { pagesOfHomepage } = require("./pages-homepage");

exports.additionalPages = async () => {
  const { pages: mediaPages, mediaByCategory } = await pagesOfMediaCategories({
    dataCsv: PATH_DATA_CSV,
    orderingJson: PATH_ORDERING_JSON,
    baseRoute: ROUTE_MEDIA_BASE,
    genMediaDataDir: PATH_GEN_MEDIA,
    categoryToSubRoute,
  });

  const { pages: homePages, info } = await pagesOfHomepage({
    baseRoute: ROUTE_MEDIA_BASE,
    mediaByCategory,
    originalFile: PATH_README,
  });

  return {
    pages: [...mediaPages, ...homePages],
    mediaByCategory,
    title: info.title,
    description: info.description,
    shortName: SITE_SHORT_NAME,
  };
};
