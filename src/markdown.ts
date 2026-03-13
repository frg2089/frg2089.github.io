interface MarkdownOptions {
  indexName: string
  lang?: string | ((context: Crawler.PageContext) => string)
}
interface MarkdownData extends Crawler.IndexData {
  title: string
  text: string
  lang: string
  tags?: any
  categories?: any
  url: string
  part: number
}

export const markdown = (
  options: MarkdownOptions,
): Crawler.Processor<MarkdownData> => {
  const indexName = options.indexName
  const language = options.lang ?? 'en-US'

  return context => {
    if (!context.content) return
    if (context.frontmatter.article === false) return

    const part = 0
    const objectID = `${context.url}#${part}`
    let title = context.frontmatter.title

    if (!title) {
      const lines = context.content.split(/\r?\n|\r/)
      title = lines
        .find(i => i.startsWith('# '))
        ?.substring(2)
        .trim()
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
