> [!NOTE]
> 快速笔记  
> 记录 HSTS 强制 https 的解决方案
>
> 解决同事直呼魔法的 HSTS 问题

# 由于 HSTS 导致的 http 自动重定向到 https 的解决方案

HSTS（HTTP Strict Transport Security）是一种网络安全机制，强制浏览器只能通过 HTTPS 连接访问网站。以下是如何在不同浏览器中清除 HSTS 缓存的方法。

## 基于 Chromium 的浏览器 （Google Chrome \ Microsoft Edge \ 360 浏览器 \ ... ）

1. 在地址栏输入 [`chrome://net-internals/#hsts`](chrome://net-internals/#hsts)
2. 在 `Delete domain` 部分输入要删除 HSTS 设置的域名，然后点击 `Delete`。
3. 可以在 `Query domain` 部分输入域名，点击 `Query` 以确认是否删除成功。
