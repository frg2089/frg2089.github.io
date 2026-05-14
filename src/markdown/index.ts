import type { PageContext, Processor } from '../indexer'
import type { MarkdownData } from './MarkdownProcessor'
import { MarkdownProcessor } from './MarkdownProcessor'

/**
 * @description Markdown 索引处理器配置选项
 */
export interface MarkdownOptions {
  /**
   * @description 索引名称
   */
  indexName: string
  /**
   * @description 语言代码或语言获取函数
   */
  lang?: string | ((context: PageContext) => string)
}

/**
 * @description 创建 Markdown 索引处理器工厂函数 将完整的 markdown 文件作为单个搜索索引
 *
 * @param options - 处理器配置选项
 *
 * @returns 处理器函数
 */
export const markdown = (options: MarkdownOptions): Processor<MarkdownData> => {
  const processor = new MarkdownProcessor(options)

  return context => processor.process(context)
}
