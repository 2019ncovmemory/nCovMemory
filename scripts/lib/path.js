"use strict";

const path = require("path");
const fs = require("fs").promises;
const rimraf = require("rimraf");

function mkdirpSingle(dir) {
  return fs.mkdir(dir, { recursive: true });
}

exports.mkdirp = dir => {
  if (Array.isArray(dir)) {
    const dirs = [...new Set(dir.map(d => path.resolve(d))).values()];
    return Promise.all(dirs.map(mkdirpSingle));
  } else {
    return mkdirpSingle(dir);
  }
};

exports.rimraf = (...dirs) =>
  dirs.length === 0
    ? Promise.resolve()
    : dirs.length === 1
    ? new Promise((resolve, reject) =>
        rimraf(dirs[0], err => {
          if (err) reject(err);
          else resolve();
        }),
      )
    : Promise.all(dirs.map(dir => rimraf(dir)));

exports.rimrafChildren = (...dirs) =>
  dirs.length === 0
    ? Promise.resolve()
    : dirs.length === 1
    ? this.rimraf(path.join(dirs[0], "*"))
    : Promise.all(dirs.map(dir => this.rimraf(path.join(dir, "*"))));

exports.normalizeSep = (p, sep = "/") =>
  path
    .normalize(p)
    .split(path.sep)
    .join(sep);
