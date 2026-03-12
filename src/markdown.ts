import MarkdownIt from 'markdown-it'

interface MarkdownOptions {
  indexName: string
  lang?: string | ((context: Crawler.PageContext) => string)
}

const md = MarkdownIt()

export const markdown = (options: MarkdownOptions): Crawler.Processor => {
  const indexName = options.indexName
  const language = options.lang ?? 'en-US'

  return context => {
    if (!context.content) return
    if (context.frontmatter.article === false) return

    const part = 0
    const objectID = `${context.url}#${part}`
    let title = context.frontmatter.title

    if (!title) {
      const tokens = md.parse(context.content, {})
      const index = tokens.findIndex(i => i.tag === 'h1')
      title = tokens[index + 1]?.content
    }

    const lang = typeof language === 'function' ? language(context) : language
    const tags = context.frontmatter.tags
    const categories = context.frontmatter.categories

    return {
      name: indexName,
      objectID,
      data: {
        objectID,
        title,
        text: context.content,
        lang,
        tags,
        categories,
        url: context.url,
        part,
      },
    }
  }
}
