# nCovMemory site publisher

## 可配置环境变量

- `CUSTOM_DATA_REPO`

  指定获取数据的 GitHub repo

  默认为 `2019ncovmemory/nCovMemory`

  会从此 repo 获取 `data/data.csv` 和 `data/README.handlebars`

- `CUSTOM_RESOURCE_REPO`

  指定获取资源的 GitHub repo

  默认为 `CUSTOM_DATA_REPO` 的值

  目前，仅加载图片时需要用到此环境变量

- `CUSTOM_BASE`

  指定发布网页的路径

  默认为 `/`

  vuepress 的 [`base` 配置](https://vuepress.vuejs.org/config/#base) 会被设置为此环境变量

- `DEV_MEDIA_MAX_COUNT`

  在开发中，可以使用此环境变量仅加载部分媒体，以节省开发时间。

  如果设置为数字，则每个类别最多加载此数量的媒体；如果设置为非空字符串，则相当于设置为 2.
