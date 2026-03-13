import { Parser } from 'htmlparser2'
import * as path from 'node:path'
import * as Url from 'node:url'
import { createMarkdownRenderer } from 'vitepress'

interface TreeNode {
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6
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

interface ContentData extends Crawler.IndexData {
  weight: {
    pageRank: number
    level: number
    position: number
  }
  lang: string
  language: string
  version: string
  content?: string
  type: string
  hierarchy: {
    lvl0: string
    lvl1?: string
    lvl2?: string
    lvl3?: string
    lvl4?: string
    lvl5?: string
    lvl6?: string
  }
  tags?: string[]
  categories?: string[]
  url_without_variables: string
  url_without_anchor: string
  anchor?: string
  content_camel?: string
  no_variables: boolean
  recordVersion: string
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
): Promise<Crawler.Processor<ContentData>> => {
  const indexName = options.indexName
  const language = options.lang ?? 'en-US'

  const _lvl0 = options.lvl0
  const vitepressConfig = Url.pathToFileURL(
    path.resolve(options.vitepressConfig),
  ).href
  const md = await getRenderer(vitepressConfig)

  return async context => {
    const buildIndex = (
      indexName: string,
      objectID: string,
      content: Nullable<string>,
      node: TreeNode,
      parent: Partial<ContentData>,
      i: number,
    ): Crawler.Index<ContentData> => {
      const lang = typeof language === 'function' ? language(context) : language
      const tags = context.frontmatter.tags
      const categories = context.frontmatter.categories
      const anchor = node.title?.toLowerCase().replaceAll(/\s/g, '-')
      const url = anchor
        ? `${context.url}#${encodeURIComponent(anchor)}`
        : context.url

      const common: Crawler.Index<ContentData> = {
        name: indexName,
        objectID,
        data: {
          ...parent,
          objectID,
          weight: {
            pageRank: 0,
            level: 0,
            position: i,
          },
          lang,
          language: lang,
          version: '',
          content: undefined,
          type: undefined!,
          hierarchy: {
            lvl0: undefined!,
            lvl1: undefined,
            lvl2: undefined,
            lvl3: undefined,
            lvl4: undefined,
            lvl5: undefined,
            lvl6: undefined,
            ...parent?.hierarchy,
            [`lvl${node.level}`]:
              node.title ?? parent?.hierarchy?.[`lvl${node.level}`],
          },
          tags,
          categories,
          url,
          url_without_variables: url,
          url_without_anchor: context.url,
          anchor,
          content_camel: undefined,
          no_variables: false,
          recordVersion: 'v3',
        },
      }

      return content
        ? {
            ...common,
            data: {
              ...common.data,
              objectID,
              content,
              content_camel: content,
              type: 'content',
            },
          }
        : {
            ...common,
            data: {
              ...common.data,
              objectID,
              weight: {
                ...common.data.weight,
                level: 100 - node.level * 10,
              },
              type: `lvl${node.level}`,
            },
          }
    }

    function* build(
      node: TreeNode,
      i: number,
      parent: Partial<ContentData>,
    ): Generator<Crawler.Index<ContentData>> {
      if (node.level !== 0 && node.title) {
        const objectID = `${i}-${context.url}`
        yield buildIndex(indexName, objectID, undefined, node, parent, i)
        i++
      }

      const content = node.content?.length
        ? getText(md.render(node.content.join('\r\n')))
        : undefined

      if (content) {
        const objectID = `${i}-${context.url}`
        yield buildIndex(indexName, objectID, content, node, parent, i)
        i++
      }

      if (node.children?.length) {
        const index = buildIndex(indexName, '', undefined, node, parent, i)
        for (const element of node.children) {
          for (const resultIndex of build(element, i, index.data)) {
            yield resultIndex
            i++
          }
        }
      }
    }

    const lines = context.content.split(/\r?\n|\r/)
    const tree: TreeNode = {
      level: 0,
    }

    let current = tree
    let code = false
    for (const line of lines) {
      if (line.startsWith('```')) code = !code

      if (!code && line.startsWith('#')) {
        // 标题
        const space = line.indexOf(' ')
        const title = line.substring(space + 1)
        const level = Math.min(line.substring(0, space).length, 6)

        while (level < current.level) {
          current = current.parent!
        }
        while (level > current.level) {
          const parent = current
          current = {
            parent,
            level: (parent.level + 1) as any,
          }
          parent.children ??= []
          parent.children.push(current)
        }
        const parent = current.parent ?? tree
        current = {
          parent,
          level: (parent.level + 1) as any,
        }

        parent.children ??= []
        parent.children.push(current)

        current.title = title
      } else {
        current.content ??= []
        current.content.push(line)
      }
    }

    const lvl0 =
      (typeof _lvl0 === 'function' ? _lvl0(context) : _lvl0) ?? 'Document'
    return await Array.fromAsync(build(tree, 0, { hierarchy: { lvl0 } }))
  }
}
