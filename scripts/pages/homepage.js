"use strict";

const { templateForHomepage } = require("../../templates/homepage");

exports.pagesOfHomepage = async ({
  title,
  description,
  defaultLink,
  route,
  /** processed content of homepage README.md */
  content,
}) => {
  return [
    {
      path: route,
      content: templateForHomepage({
        title,
        description,
        defaultLink,
        content,
      }),
    },
  ];
};
