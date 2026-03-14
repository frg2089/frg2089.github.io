import type { Index, PageContext } from '../indexer'
import type { ContentData } from './ContentProcessor'
import { TreeNode } from './TreeNode'

/** 内容索引处理器配置选项 */
interface ContentOptions {
  vitepressConfig: string
  indexName: string
  lang?: string | ((context: PageContext) => string)
  lvl0?: string | ((context: PageContext) => string)
}

/**
 * 索引构建器
 * 负责将树节点转换为 Algolia 搜索索引数据
 */
export class IndexBuilder {
  private readonly indexName: string
  private readonly language: string | ((context: PageContext) => string)
  private readonly lvl0: string | ((context: PageContext) => string) | undefined
  private readonly context: PageContext

  constructor(options: ContentOptions, context: PageContext) {
    this.indexName = options.indexName
    this.language = options.lang ?? 'en-US'
    this.lvl0 = options.lvl0
    this.context = context
  }

  /**
   * 获取语言代码
   */
  private getLanguage(): string {
    return typeof this.language === 'function'
      ? this.language(this.context)
      : this.language
  }

  /**
   * 获取顶级分类名称
   */
  private getLvl0(): string {
    if (!this.lvl0) return 'Document'
    return typeof this.lvl0 === 'function' ? this.lvl0(this.context) : this.lvl0
  }

  /**
   * 根据标题创建锚点
   * @param title - 标题文本
   * @returns 锚点字符串
   */
  private createAnchor(title: string): string {
    return title.toLowerCase().replaceAll(/\s/g, '-')
  }

  /**
   * 创建完整的 URL（包含锚点）
   * @param anchor - 锚点字符串
   * @returns 完整 URL
   */
  private createUrl(anchor?: string): string {
    if (!anchor) return this.context.url
    return `${this.context.url}#${encodeURIComponent(anchor)}`
  }

  /**
   * 创建层级结构
   * @param node - 树节点
   * @param parent - 父级数据
   * @returns 层级结构对象
   */
  private createHierarchy(
    node: TreeNode,
    parent: Partial<ContentData>,
  ): ContentData['hierarchy'] {
    return {
      lvl0: parent.hierarchy?.lvl0 ?? this.getLvl0(),
      lvl1: undefined,
      lvl2: undefined,
      lvl3: undefined,
      lvl4: undefined,
      lvl5: undefined,
      lvl6: undefined,
      ...parent?.hierarchy,
      [`lvl${node.level}`]:
        node.title ??
        parent?.hierarchy?.[
          `lvl${node.level}` as keyof ContentData['hierarchy']
        ],
    } as ContentData['hierarchy']
  }

  /**
   * 创建基础索引数据
   * @param objectID - 对象 ID
   * @param node - 树节点
   * @param parent - 父级数据
   * @param position - 位置序号
   * @returns 索引数据
   */
  public createBaseData(
    objectID: string,
    node: TreeNode,
    parent: Partial<ContentData>,
    position: number,
  ): ContentData {
    const anchor = node.title ? this.createAnchor(node.title) : undefined
    const url = this.createUrl(anchor)

    return {
      ...parent,
      objectID,
      weight: {
        pageRank: 0,
        level: 0,
        position,
      },
      lang: this.getLanguage(),
      language: this.getLanguage(),
      version: '',
      content: undefined,
      type: undefined!,
      hierarchy: this.createHierarchy(node, parent),
      tags: this.context.frontmatter.tags,
      categories: this.context.frontmatter.categories,
      url,
      url_without_variables: url,
      url_without_anchor: this.context.url,
      anchor,
      content_camel: undefined,
      no_variables: false,
      recordVersion: 'v3',
    }
  }

  /**
   * 创建内容索引（包含实际的文本内容）
   * @param objectID - 对象 ID
   * @param content - 纯文本内容
   * @param node - 树节点
   * @param parent - 父级数据
   * @param position - 位置序号
   * @returns 索引对象
   */
  public createContentIndex(
    objectID: string,
    content: string,
    node: TreeNode,
    parent: Partial<ContentData>,
    position: number,
  ): Index<ContentData> {
    const data = this.createBaseData(objectID, node, parent, position)

    return {
      name: this.indexName,
      objectID,
      data: {
        ...data,
        content,
        content_camel: content,
        type: 'content',
      },
    }
  }

  /**
   * 创建层级索引（不包含内容，仅用于导航）
   * @param objectID - 对象 ID
   * @param node - 树节点
   * @param parent - 父级数据
   * @param position - 位置序号
   * @returns 索引对象
   */
  public createLevelIndex(
    objectID: string,
    node: TreeNode,
    parent: Partial<ContentData>,
    position: number,
  ): Index<ContentData> {
    const data = this.createBaseData(objectID, node, parent, position)

    return {
      name: this.indexName,
      objectID,
      data: {
        ...data,
        weight: {
          ...data.weight,
          // 级别越低，权重越高（lvl1 权重高于 lvl6）
          level: 100 - node.level * 10,
        },
        type: `lvl${node.level}`,
      },
    }
  }

  /**
   * 获取根节点的层级结构
   * @returns 包含 lvl0 的层级对象
   */
  public getRootHierarchy(): Partial<ContentData> {
    return {
      hierarchy: {
        lvl0: this.getLvl0(),
      },
    }
  }
}
