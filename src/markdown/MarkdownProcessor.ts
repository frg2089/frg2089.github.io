/** Markdown 索引处理器配置选项 */
interface MarkdownOptions {
  indexName: string
  lang?: string | ((context: Indexer.PageContext) => string)
}

/**
 * Markdown 索引处理器
 * 将完整的 markdown 文件作为单个搜索索引
 */
export class MarkdownProcessor {
  private readonly indexName: string
  private readonly language: string | ((context: Indexer.PageContext) => string)

  constructor(options: MarkdownOptions) {
    this.indexName = options.indexName
    this.language = options.lang ?? 'en-US'
  }

  /**
   * 提取文档标题
   * 优先使用 frontmatter.title，否则使用第一个一级标题
   * @param context - 页面上下文
   * @returns 标题或 undefined
   */
  private extractTitle(context: Indexer.PageContext): string | undefined {
    const title = context.frontmatter.title
    if (title) return title

    const lines = context.content.split(/\r?\n|\r/)
    const match = lines.find(i => i.startsWith('# '))
    return match?.substring(2).trim()
  }

  /**
   * 获取语言代码
   * @param context - 页面上下文
   * @returns 语言代码
   */
  private getLanguage(context: Indexer.PageContext): string {
    return typeof this.language === 'function'
      ? this.language(context)
      : this.language
  }

  /**
   * 处理页面，生成索引
   * @param context - 页面上下文
   * @returns 索引对象或 undefined（如果被跳过）
   */
  public process(
    context: Indexer.PageContext,
  ): Indexer.Index<Indexer.MarkdownData> | undefined {
    // 跳过空内容和标记为非文章的页面
    if (!context.content) return
    if (context.frontmatter.article === false) return

    const title = this.extractTitle(context) ?? ''
    const lang = this.getLanguage(context)
    const part = 0
    const objectID = `${context.url}#${part}`

    return {
      name: this.indexName,
      objectID,
      data: {
        objectID,
        title,
        text: context.content,
        lang,
        tags: context.frontmatter.tags,
        categories: context.frontmatter.categories,
        url: context.url,
        part,
      },
    }
  }
}
