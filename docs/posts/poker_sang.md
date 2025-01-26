---
category:
  - Blog
  - Hexo
tag:
  - Hexo
  - Blog
  - SSG
sitemap: false
---

# 构建扑克的博客

> [!important]
> 笨蛋扑克已经改用 vuepress 2 了，这个文章也过期了，留着凑个数

前几天，笨蛋扑克([@Poker-sang](https://github.com/poker-sang))突然找到我说他建好了一个个人博客网站。
他想将这个放到 [Github Actions](https://github.com/features/actions) 中自动化部署，问我有没有什么方案。

~~闲的没事干~~**乐于助人**的我自然是答应了这个请求。
我就问了一下他的项目的组织方式。

他说有四个仓库。

啊？四个？

我让他把整个项目都发过来，我看看。

这是一个用[Hexo](https://hexo.io/)和（[安知鱼主题](https://docs.anheyu.com/)构建的静态的博客。

我有好几年没用Hexo了欸！
不过在我的印象里，它需要用[Node.js](https://nodejs.org/)。

既然是用node的那就好办了。

他跟我说他分成了这样的四个仓库：

- 主仓库（[Hexo](https://hexo.io/) 项目仓库）
- 文章仓库
- 主题仓库（[安知鱼主题](https://docs.anheyu.com/)仓库）
- 发布仓库（[Github Pages](https://pages.github.com/) 仓库）

虽然四个仓库不是不能用[Github Actions](https://github.com/features/actions)来处理，但是我懒，不想去写那么复杂的CI。

那么就只能...

## 减少仓库数量

### 去掉发布仓库

由于[Github Pages](https://pages.github.com/)可以使用[Github Actions](https://github.com/features/actions)的[actions/deploy-pages](https://github.com/marketplace/actions/deploy-github-pages-site)发布，而这种发布方式不需要把构建产物放到Github仓库中。
所以我成功的消灭了一个仓库。

### 去掉主题仓库

在[安知鱼主题](https://docs.anheyu.com/)的官方文档里我找到了它的[安装方式](https://docs.anheyu.com/initall.html#%E4%B8%BB%E9%A2%98%E5%AE%89%E8%A3%85-1)。
在里面发现了一种特殊的安装方式：**npm安装**。

它能用npm来安装！

这样的话，主题仓库也是没有必要的了。

简单翻了一下文档，安知鱼主题提供了[覆盖配置](https://docs.anheyu.com/initall.html#%E8%A6%86%E7%9B%96%E9%85%8D%E7%BD%AE)的方法，这是npm安装修改主题配置的唯一的方案。

> [!note]
> 这个笨蛋是完全不看文档啊...
> 人家官方明明有提供这种修改配置的方案，他却直接去改主题的 `_config.yml`...
> 所以弄出来了一个“主题仓库”

### 去掉文章仓库

已经去掉了两个仓库了。

因为主仓库里面只有几个hexo的配置文件和node的项目文件，我感觉没必要单独拆分成一个仓库。
于是问了一下他要不要把这两个仓库合并到一起，他回答说：可以。

这样一来，我就成功的将四个仓库缩减成了一个。

剩下的就没什么问题了，写个CI让他推送的时候运行就可以了。

成品：[笨蛋扑克的博客](https://poker-sang.github.io/)

~~他这不得给我磕一个~~
