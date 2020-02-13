"use strict";

const { main } = require("./index");

(async () => {
  await main();
})().catch(err => {
  console.log(err);
});
