type PromiseOr<T> = PromiseLike<T> | T
type Nullable<T> = T | undefined | null

declare namespace Crawler {
  export interface CrawlerOptions {
    /** 主机名 */
    host: string
    /** markdown 文件夹 */
    src: string

    appId: string

    processors: Array<Processor>
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
  }
  export interface Index {
    name: string
    objectID: string
    data: IndexData
  }

  export interface Processor {
    (
      context: PageContext,
    ): PromiseOr<Nullable<Index>[]> | PromiseOr<Nullable<Index>>
  }
}
