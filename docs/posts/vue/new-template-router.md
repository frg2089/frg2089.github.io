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
---

我觉得有必要在这里提一嘴这个好用的插件

# unplugin-vue-router

它可以根据文件系统结构来生成路由页面

稍加修改就可以配合 ViteSSG 做到根据不同的语言生成不同的路由

```plain
./src/pages/
  + index.vue
  + demo/[id].vue
===================
/zh/          => index.vue
/zh/demo/:id  => demo/[id].vue
/en/          => index.vue
/en/demo/:id  => demo/[id].vue
```

:::details 我把我的代码留在这里了，有需要的自取

```typescript
// vite.config.ts
import { type EditableTreeNode } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'

// ...

const locales = ['zh', 'en']

const makeRoute = (
  route: EditableTreeNode,
  parent: EditableTreeNode,
  locale: string,
  path: string,
  file?: string,
) => {
  //
  const newRoute = parent.insert(path, file as any)
  if (file == null) newRoute.components.clear()

  // copy meta data
  newRoute.addToMeta(route.meta)

  newRoute.addToMeta({ locale })

  // process children
  route.children.forEach(subRoute => {
    const newSubRoute = makeRoute(
      subRoute,
      newRoute,
      locale,
      subRoute.path,
      subRoute.components.get('default'),
    )
  })

  return newRoute
}

// ...

VueRouter({
  beforeWriteFiles: async root => {
    routes.children.forEach(route => {
      const file = route.components.get('default')
      const path = route.path

      // make i18n route
      locales.forEach(locale => {
        const newRoute = makeRoute(
          route,
          root,
          locale,
          `/${locale}${path}`,
          file,
        )
      })

      route.delete()
    })
  },
}),

// ...
```

:::

[原始地址](https://github.com/posva/unplugin-vue-router/discussions/368#discussion-6540509)
