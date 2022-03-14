---
title: "npm 和 yarn 的对比"
date: "2022-02-21"
---

# npm 和 yarn 的对比

## 简而言之

Yarn over npm.

yarn 是 facebook 主导的 Node.js 包管理工具，它能够：

1. 安装更快（并行安装，相较于与 npm 的串行更快）

2. 离线安装（对已经安装过的包，支持离线安装）

3. 使用 yarn.lock 文件保证锁定所有依赖的版本（npm v5.x 开始支持）

4. 更安全（防止在安装时执行代码）

## 使用

- yarn 能够自动读取 `package.json` 文件，格式几乎都可以互相兼容。生成独有的 `yarn.lock` 文件，确保其他人使用 yarn 能够获取一样的依赖。

- 大型项目中，`package.json` 中信息不够明确，依赖关系出现冲突，这时候应该先删除 `node_modules` 重新安装，使得依赖项的版本更明确。这时再转换到 yarn 上。 

## npm 和 yarn 的命令之区别

> cf: [CLI commands comparison](https://classic.yarnpkg.com/en/docs/migrating-from-npm#toc-cli-commands-comparison)

| **npm (v5)**                          | **Yarn**                      |
|---------------------------------------|-------------------------------|
| npm install                           | yarn add                      |
| (N/A)                                 | yarn add --flat               |
| (N/A)                                 | yarn add --har                |
| npm install --no-package-lock         | yarn add --no-lockfile        |
| (N/A)                                 | yarn add --pure-lockfile      |
| npm install [package] --save          | yarn add [package]            |
| npm install [package] --save-dev      | yarn add [package] --dev      |
| (N/A)                                 | yarn add [package] --peer     |
| npm install [package] --save-optional | yarn add [package] --optional |
| npm install [package] --save-exact    | yarn add [package] --exact    |
| (N/A)                                 | yarn add [package] --tilde    |
| npm install [package] --global        | yarn global add [package]     |
| npm update --global                   | yarn global upgrade           |
| npm rebuild                           | yarn add --force              |
| npm uninstall [package]               | yarn remove [package]         |
| npm cache clean                       | yarn cache clean [package]    |
| rm -rf node_modules  npm install      | yarn upgrade                  |
| npm version major                     | yarn version --major          |
| npm version minor                     | yarn version --minor          |
| npm version patch                     | yarn version --patch          |

## 结论

npm 5.x 之后，磨平了和 yarn 之间的很多差距，比如安装速度、离线安装和依赖版本的锁定等问题，不过 yarn 某些情况下还是会快些。使用哪一个，也仅仅是用户的偏好的问题。
