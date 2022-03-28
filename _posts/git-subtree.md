---
title: "git subtree 的使用"
date: "2022-02-19"
---

# git subtree 的使用

今天使用 github pages 部署基于 next.js 的博客时，因为需要将 `next build && next export` 出来的 `/out/` 中的内容看作一个独立的仓库上传到对应的 `gh-pages` 分支，需要执行一个陌生的 git 命令，`git subtree`。

查了一下，这个命令允许我们**将当前目录的一部分**当作是一个独立的 git 仓库，进行管理分支管理，并能够上传到远程仓库。

简而言之，如果你想要在同一个 git 仓库中同时管理一些子仓库，那就需要使用 `git subtree`。

子仓库中的管理方式和普通仓库的管理方式类似，我们可以对子仓库的代码进行单独退拉等操作（但是都得在父目录中执行）。

## 什么时候使用？

当你想要一个子仓库跟着项目走，但是又能不和项目完全同步（能独立地管理）。子仓库适合一些管理一些和仓库内容高度相关的配置文件或打包导出的内容。

## 使用 `git subtree`

### 第一步：添加远程仓库

语法：`git remote add -f <子仓库名> <子仓库地址>`

示例：`git remote add -f component git@xxx.git`

验证：`git remote -v` 能查看到我们新建成功一个叫 component 的仓库

### 第二步：创建本地目录

语法：`git subtree add --prefix=<子目录名> <子仓库名> <分支> --squash`

示例：`git subtree add --prefix=out component master --squash`

`git subtree add` 会在本地新建一个叫 out 的文件夹，`--squash` 会把 subtree 上的改动合并成一次 commit

### 第三步：推拉代码

pull：`git subtree pull --prefix=out component master --squash`

push：`git subtree push --prefix=out component master --squash`

注意：必须在**根目录（父仓库）下**执行该命令，因为子仓库本质上是由父仓库接管的。同理，代码的提交也和父仓库一起，只需要 `git commit` 父仓库，子仓库的代码也会自动被加入缓存区（和正常代码一样）。

### 第四步：添加到 package.json

因为毕竟推拉命令都是常用的，并且 `git subtree` 的相关代码都比较又长又臭，所以建议在 package.json 中添加对应的 npm script 来执行，这样也避免了在子目录下执行 `git subtree`。

## 总结

`git subtree` 的使用和 `git submodule` 的使用还是有一定区别的，适合不同的工作流。前者侧重于子项目跟着父项目走的情况，后者侧重于开发阶段引用的子模块，本身并不用跟着父项目版本走。

## 参考

1. [Git Subtree和Submodule的使用](https://lionjohn.gitbooks.io/gitcookbook/content/chapter2/section1/4.html)

2. [Git subtree: the alternative to Git submodule](https://www.atlassian.com/git/tutorials/git-subtree)

3. [git subtrees: a tutorial](https://medium.com/@v/git-subtrees-a-tutorial-6ff568381844)