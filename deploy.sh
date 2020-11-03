#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

#更新博客笔记线上文件
git pull git@github.com:cometang/blog.git master
git add -A
git commit -m 'newNotice'
git push -f git@github.com:cometang/blog.git master


# 进入生成的文件夹 更新博客显示项目
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME


git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
git push -f git@github.com:cometang/cometang.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -