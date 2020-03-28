"use strict";

const crypto = require("crypto");

function base64EncodeUrl(str) {
  return str
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

exports.hash = str =>
  base64EncodeUrl(
    crypto
      .createHash("md5")
      .update(str)
      .digest("base64"),
  );
