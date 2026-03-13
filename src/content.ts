import { Parser } from 'htmlparser2'
import * as path from 'node:path'
import * as Url from 'node:url'
import { createMarkdownRenderer } from 'vitepress'

interface TreeNode {
  level: number
  parent?: TreeNode
  children?: TreeNode[]
  title?: string
  content?: string[]
}

interface ContentOptions {
  vitepressConfig: string
  indexName: string
  lang?: string | ((context: Crawler.PageContext) => string)
  lvl0?: string | ((context: Crawler.PageContext) => string)
}

const getRenderer = async (vitepressConfig: string) => {
  const config = await import(vitepressConfig)

  // 创建 Markdown 渲染器
  const md = await createMarkdownRenderer(
    config.srcDir, // 源文件目录
    config.markdown, // Markdown 配置选项
    config.site?.base, // 基础路径
    config.logger, // 日志记录器
  )

  return md
}

const getText = (html: string) => {
  const textParts: string[] = []

  const parser = new Parser({
    ontext(text) {
      textParts.push(text)
    },
  })

  parser.write(html)
  parser.end()
  return textParts.join('')
}

export const content = async (
  options: ContentOptions,
): Promise<Crawler.Processor> => {
  const _lvl0 = options.lvl0
  const vitepressConfig = Url.pathToFileURL(
    path.resolve(options.vitepressConfig),
  ).href
  const md = await getRenderer(vitepressConfig)

  return async context => {
    function* build(
      node: TreeNode,
      i: number,
      parent?: Partial<Crawler.Index['data']>,
    ): Generator<Crawler.Index> {
      const objectID = `${i}-${context.url}`
      const url = node.title
        ? `${context.url}#${encodeURIComponent(node.title)}`
        : context.url

      const content = node.content?.length
        ? getText(md.render(node.content.join('\r\n')))
        : undefined

      const index: Crawler.Index = {
        name: options.indexName,
        objectID: objectID,
        data: {
          ...parent,
          objectID,
          url,
          [`lvl${node.level}`]: node.title ?? parent?.[`lvl${node.level}`],
          content,
        },
      }

      if (index.data.content?.length) {
        yield index
      }

      if (node.children?.length) {
        for (let j = 0; j < node.children.length; j++) {
          const element = node.children[j]
          for (const resultIndex of build(element, i + j, index.data)) {
            yield resultIndex
          }
        }
      }
    }

    const lines = context.content.split(/\r?\n|\r/)
    const tree: TreeNode = {
      level: 0,
    }

    let current = tree
    for (const line of lines) {
      if (line.startsWith('#')) {
        // 标题
        const space = line.indexOf(' ')
        const title = line.substring(space + 1)
        const level = line.substring(0, space).length

        if (level > current.level) {
          while (level > current.level) {
            const parent = current
            current = {
              parent,
              level: parent.level + 1,
            }
            parent.children ??= []
            parent.children.push(current)
          }
        } else {
          while (level < current.level) {
            current = current.parent!
          }
          const parent = current.parent ?? tree
          current = {
            parent,
            level: parent.level + 1,
          }

          parent.children ??= []
          parent.children.push(current)
        }

        current.title = title
      } else {
        current.content ??= []
        current.content.push(line)
      }
    }

    const lvl0 = typeof _lvl0 === 'function' ? _lvl0(context) : _lvl0

    return await Array.fromAsync(build(tree, 0, { lvl0 }))
  }
}
