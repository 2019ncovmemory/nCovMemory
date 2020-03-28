"use strict";

const path = require("path");
const fs = require("fs").promises;

const { download } = require("../lib/request");
const { mkdirp } = require("../lib/path");

const { resources } = require("../resources");

exports.prepare = async noDownloadWhenExists => {
  let rs = resources;
  if (noDownloadWhenExists) {
    const rsWithExists = await Promise.all(
      rs.map(async r => {
        try {
          await fs.access(r[1]);
          console.log(`skip downloading ${r[1]} as it exists`);
          return [r, true];
        } catch (_) {
          return [r, false];
        }
      }),
    );
    rs = rsWithExists.filter(r => !r[1]).map(r => r[0]);
  }

  await mkdirp(rs.map(r => path.dirname(r[1])));
  await Promise.all(rs.map(r => download(r[0], r[1])));
};
