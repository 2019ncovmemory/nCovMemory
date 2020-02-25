# nCovMemory site publisher

## 发布流程

> 需要在 Node.js >=12 环境下进行

```shell
# 安装依赖
yarn install

# 生成网站
###########
# 此操作会先从 GitHub 下载 data/data.csv 和 data/README.handlebars 文件到 gen 文件夹
# 然后在 gen 文件夹中生成一些临时文件
# 并生成网站，生成的文件在 docs/.vuepress/dist 文件夹
yarn build-site

# 发布网站
###########
# 切换到生成网站的文件夹
cd docs/.vuepress/dist
# 在此处初始化一个新的 git 仓库并提交所有文件
git init
git add -A
git commit -m 'deploy'
# 此操作会将生成的文件发布到 2019ncovmemory/nCovMemory 的 gh-pages 分支
# 由于使用了 force push，请注意不要操作错误
git push -f https://github.com/2019ncovmemory/nCovMemory.git master:gh-pages

```

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
