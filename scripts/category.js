"use strict";

const categoryInfo = {
  non_fiction: { route: "non-fiction/", title: "传媒报道与非虚构写作" },
  narrative: { route: "narrative/", title: "亲历者个人叙述" },
};

exports.definedCategoryNames = Object.keys(categoryInfo);

exports.definedCategoryTitles = this.definedCategoryNames.map(
  c => categoryInfo[c].title,
);

exports.categoryTitleToName = t =>
  this.definedCategoryNames[this.definedCategoryTitles.indexOf(t.trim())];

exports.categoryToSubRoute = category => {
  if (categoryInfo[category] && categoryInfo[category].route) {
    return categoryInfo[category].route;
  } else {
    const r = category + "/";
    console.warn(
      `Route of category "${category}" not specified implicitly. Using "${r}" as default`,
    );
    return r;
  }
};
exports.categoryToTitle = category => {
  if (categoryInfo[category] && categoryInfo[category].title) {
    return categoryInfo[category].title;
  } else {
    console.warn(
      `Route of category "${category}" not specified implicitly. Using "${category}" as default`,
    );
    return category;
  }
};
