type PromiseOr<T> = PromiseLike<T> | T
type Nullable<T> = T | undefined | null

declare namespace Indexer {
  export interface IndexerOptions {
    /** 主机名 */
    host: string
    /** markdown 文件夹 */
    src: string

    appId: string
    /** Algolia API Key */
    apiKey?: string
    /** 干运行模式，不上传到 Algolia */
    dryRun?: boolean

    processors: Array<PromiseOr<Processor>>
  }

  export interface PageContext {
    relativePath: string
    absolutePath: string
    url: string
    frontmatter: Record<string, any>
    content: string
  }

  export interface IndexData extends Record<string, any> {
    objectID: string
    url: string
  }

  export interface Index<TData extends IndexData> {
    name: string
    objectID: string
    data: TData
  }

  export interface Processor<TData extends IndexData> {
    (
      context: PageContext,
    ): PromiseOr<Nullable<Index<TData>>[]> | PromiseOr<Nullable<Index<TData>>>
  }

  export interface MarkdownData extends IndexData {
    title: string
    text: string
    lang: string
    tags?: any
    categories?: any
    url: string
    part: number
  }

  export interface ContentData extends IndexData {
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
}
