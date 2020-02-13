"use strict";

const stream = require("stream");
const util = require("util");
const pipeline = util.promisify(stream.pipeline);

const request = require("request");
const fs = require("fs");

exports.download = (url, file) =>
  pipeline(request(url), fs.createWriteStream(file));
