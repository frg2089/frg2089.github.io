---
category:
  - 前端
  - Vue
  - Vue3
tag:
  - 前端
  - Vue
  - Vue3
  - Vite
  - vue-router
sitemap: false
---

> [!important]
> 文章已经过期了，留在这凑数的

不知道各位前端人有没有因为添加页面需要去修改router.ts而烦恼过？

咱在这里隆重推荐一款vite插件，它可以使你从切换.vue和router.ts中解放出来，您只需要在.vue文件中编写路由即可

# Template Router

```html
<template path="/path" layout="Layout">
  <!-- ... -->
</template>
```

您可以在[这里](https://github.com/ShimakazeProject/Shimakaze.Client/tree/develop/src/Shimakaze.Client.UI/plugins/InlineRouter)找到这个扩展

您可以将这个文件复制到您自己的项目中使用，但您需要注明此代码的来源。

```ts
// vue-plugin-template-router
// Author: @frg2089
// License: MIT License
// Copyright © 2023 frg2089
```

若您希望我将这个扩展移至一个单独的仓库中请在[Shimakaze.Client](https://github.com/ShimakazeProject/Shimakaze.Client)项目中告诉我(issue)
