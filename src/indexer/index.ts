import { algoliasearch } from 'algoliasearch'
import matter from 'gray-matter'
import * as fs from 'node:fs'
import * as path from 'node:path'

/**
 * 索引构建器类
 * 负责从 markdown 文件中提取内容并构建 Algolia 搜索索引
 */
class Indexer {
  private readonly options: Indexer.IndexerOptions
  private readonly baseUrl: URL
  private readonly client?: ReturnType<typeof algoliasearch>

  constructor(options: Indexer.IndexerOptions) {
    this.options = options
    this.baseUrl = new URL(`https://${options.host}`)

    // 仅在非 dry-run 模式且提供了 API key 时初始化 Algolia 客户端
    this.client =
      !options.dryRun && options.apiKey
        ? algoliasearch(options.appId, options.apiKey)
        : undefined
  }

  /**
   * 根据相对路径构建完整的 URL
   * @param relativePath - 相对于 src 目录的文件路径
   * @returns 完整的 URL
   */
  private buildUrl(relativePath: string): string {
    // 将 .md 替换为 .html
    let urlPath =
      relativePath.substring(0, relativePath.length - 3).replaceAll('\\', '/') +
      '.html'

    // 移除 index.html 的后缀，使其指向目录
    if (urlPath.endsWith('index.html')) {
      urlPath = urlPath.substring(0, urlPath.length - 10)
    }

    return new URL(urlPath, this.baseUrl).href
  }

  /**
   * 递归获取所有 markdown 文件
   * @returns markdown 文件的相对路径列表
   */
  private async getMarkdownFiles(): Promise<string[]> {
    const src = path.resolve(this.options.src)
    const files = await fs.promises.readdir(src, { recursive: true })
    return files.filter(file => path.extname(file).toLowerCase() === '.md')
  }

  /**
   * 创建页面上下文对象
   * @param relativePath - 相对路径
   * @returns 包含路径、URL、frontmatter 和内容的上下文对象
   */
  private async createPageContext(
    relativePath: string,
  ): Promise<Indexer.PageContext> {
    const absolutePath = path.resolve(this.options.src, relativePath)
    const url = this.buildUrl(relativePath)

    const raw = await fs.promises.readFile(absolutePath, {
      encoding: 'utf-8',
    })

    // 解析 frontmatter 和内容
    const { data, content } = matter(raw)

    return {
      relativePath,
      absolutePath,
      url,
      frontmatter: data,
      content,
    }
  }

  /**
   * 处理单个页面，通过所有 processor 提取索引数据
   * @param relativePath - 相对路径
   * @returns 索引数据数组
   */
  private async processPage(
    relativePath: string,
  ): Promise<Indexer.Index<Indexer.IndexData>[]> {
    const context = await this.createPageContext(relativePath)
    const results: Indexer.Index<Indexer.IndexData>[] = []

    // 依次处理所有 processor
    for (const processor of this.options.processors) {
      const resolvedProcessor = await processor
      const index = await resolvedProcessor(context)

      // processor 可能返回单个索引或数组
      if (Array.isArray(index)) {
        results.push(...index)
      } else if (index) {
        results.push(index)
      }
    }

    return results
  }

  /**
   * 按索引名称分组索引数据
   * @param indexes - 所有索引数据
   * @returns 按索引名称分组的映射
   */
  private groupByIndexName(
    indexes: Indexer.Index<Indexer.IndexData>[],
  ): Record<string, Record<string, Indexer.IndexData>> {
    return indexes.reduce(
      (acc, index) => {
        acc[index.name] ??= {}
        acc[index.name][index.objectID] = index.data
        return acc
      },
      {} as Record<string, Record<string, Indexer.IndexData>>,
    )
  }

  /**
   * 将索引数据上传到 Algolia
   * @param indices - 按索引名称分组的数据
   */
  private async uploadToAlgolia(
    indices: Record<string, Record<string, Indexer.IndexData>>,
  ): Promise<void> {
    if (!this.client) return

    for (const [indexName, indexes] of Object.entries(indices)) {
      // 先清空旧数据
      await this.client.clearObjects({ indexName })

      // 批量添加新数据
      for (const [objectID, body] of Object.entries(indexes)) {
        const response = this.client.addOrUpdateObject({
          indexName,
          objectID,
          body,
        })

        console.log(response)
      }
    }
  }

  /**
   * 执行索引构建流程
   */
  public async run(): Promise<void> {
    // 1. 获取所有 markdown 文件
    const markdownFiles = await this.getMarkdownFiles()

    // 2. 处理所有页面，提取索引数据
    const indexes = (
      await Promise.all(markdownFiles.map(file => this.processPage(file)))
    ).flat()

    // 3. 按索引名称分组
    const grouped = this.groupByIndexName(indexes)

    // 4. dry-run 模式只输出结果，不上传
    if (this.options.dryRun) {
      console.info(JSON.stringify(grouped, null, 2))
      return
    }

    // 5. 上传到 Algolia
    await this.uploadToAlgolia(grouped)
  }
}

/**
 * 索引构建入口函数
 * @param options - 索引器配置选项
 */
export const indexer = async (
  options: Indexer.IndexerOptions,
): Promise<void> => {
  const instance = new Indexer(options)
  await instance.run()
}

export default indexer
