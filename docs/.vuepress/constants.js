/* eslint-env node */

export const DATA_REPO =
  process.env.CUSTOM_DATA_REPO || "2019ncovmemory/nCovMemory";

export const RESOURCE_REPO = process.env.CUSTOM_RESOURCE_REPO || DATA_REPO;

export const BASE = process.env.CUSTOM_BASE || "/";

export const getArticleImgSrc = article =>
  typeof article === "string" || (article && article.info && article.info.id)
    ? `https://github.com/${RESOURCE_REPO}/raw/master/archive/jpg/${
        typeof article === "object" && article.info ? article.info.id : article
      }.jpg`
    : undefined;
