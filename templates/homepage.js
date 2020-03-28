"use strict";

const prependHome = ({ title, description, defaultLink }) => `---
home: true
heroText: ${title}
tagline: ${description}
actionText: 开始阅读
actionLink: ${defaultLink}
# features:
#   - title: Simplicity First
#     details: Minimal setup with markdown-centered project structure helps you focus on writing.
#   - title: Vue-Powered
#     details: Enjoy the dev experience of Vue + webpack, use Vue components in markdown, and develop custom themes with Vue.
#   - title: Performant
#     details: VuePress generates pre-rendered static HTML for each page, and runs as an SPA once a page is loaded.
# footer: MIT Licensed | Copyright © 2018-present Evan You
---

`;

exports.templateForHomepage = ({ title, description, defaultLink, content }) =>
  prependHome({ title, description, defaultLink }) + content;
