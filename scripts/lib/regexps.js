"use strict";

exports.MD_HEADER = /^(?:\s*)(?<tag>#+)(?:\s+)(?<inline>.+)$/gm;

exports.mdMatchAllHeaders = md =>
  [...md.matchAll(this.MD_HEADER)].map(res => ({
    groups: res.groups,
    raw: res[0],
    index: res.index,
  }));
