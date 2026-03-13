import { ContentProcessor } from './ContentProcessor'

/**
 * 内容索引处理器配置选项
 */
export interface ContentOptions {
  /** VitePress 配置文件路径 */
  vitepressConfig: string
  /** 索引名称 */
  indexName: string
  /** 语言代码或语言获取函数 */
  lang?: string | ((context: Indexer.PageContext) => string)
  /** 顶级分类名称或获取函数 */
  lvl0?: string | ((context: Indexer.PageContext) => string)
}

/**
 * 创建内容索引处理器工厂函数
 * 将 markdown 内容按标题层级拆分为多个搜索索引
 *
 * @param options - 处理器配置选项
 * @returns 处理器函数
 */
export const content = async (
  options: ContentOptions,
): Promise<Indexer.Processor<Indexer.ContentData>> => {
  const processor = new ContentProcessor(options)

  return context => processor.process(context)
}
