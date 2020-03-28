"use strict";

const {
  DATA_REPO,
  PATH_DATA_CSV,
  PATH_README,
  PATH_ORDERING_JSON,
} = require("./constants");

const dataCsvUrl = repo =>
  `https://github.com/${repo}/raw/master/data/data.csv`;

const readmeUrl = repo =>
  `https://github.com/${repo}/raw/master/template/README.handlebars`;

const orderingJsonUrl = repo =>
  `https://github.com/${repo}/raw/master/template/ordering.json`;

exports.resources = [
  [dataCsvUrl(DATA_REPO), PATH_DATA_CSV],
  [readmeUrl(DATA_REPO), PATH_README],
  [orderingJsonUrl(DATA_REPO), PATH_ORDERING_JSON],
];
