import { IndexBuilder } from './IndexBuilder'
import { TreeBuilder } from './TreeBuilder'
import { TreeNode } from './TreeNode'

/** 内容索引处理器配置选项 */
interface ContentOptions {
  vitepressConfig: string
  indexName: string
  lang?: string | ((context: Indexer.PageContext) => string)
  lvl0?: string | ((context: Indexer.PageContext) => string)
}

/**
 * 内容索引处理器
 * 将 markdown 内容按标题层级拆分为可搜索的索引
 */
export class ContentProcessor {
  private readonly options: ContentOptions

  constructor(options: ContentOptions) {
    this.options = options
  }

  /**
   * 递归收集树节点（前序遍历）
   * @param node - 当前树节点
   * @param nodes - 收集到的节点数组
   */
  private collectNodes(node: TreeNode, nodes: TreeNode[] = []): TreeNode[] {
    nodes.push(node)
    for (const child of node.children) {
      this.collectNodes(child, nodes)
    }
    return nodes
  }

  /**
   * 处理页面内容，生成搜索索引
   * @param context - 页面上下文
   * @returns 生成的索引数组
   */
  public async process(
    context: Indexer.PageContext,
  ): Promise<Indexer.Index<Indexer.ContentData>[]> {
    // 将 markdown 内容解析为树结构
    const tree = TreeBuilder.buildTree(context.content)
    const builder = new IndexBuilder(this.options, context)

    // 收集所有节点（前序遍历）
    const nodes = this.collectNodes(tree)
    const results: Indexer.Index<Indexer.ContentData>[] = []

    // 为每个节点创建索引
    let counter = 0
    const parentHierarchyMap = new Map<TreeNode, Partial<Indexer.ContentData>>()

    for (const node of nodes) {
      // 获取父级层级结构
      let parentData: Partial<Indexer.ContentData>
      if (node.parent) {
        parentData =
          parentHierarchyMap.get(node.parent) ?? builder.getRootHierarchy()
      } else {
        parentData = builder.getRootHierarchy()
      }

      // 为标题节点创建层级索引（如 lvl1、lvl2 等）
      if (node.level !== 0 && node.title) {
        const objectID = `${counter}-${context.url}`
        const levelIndex = builder.createLevelIndex(
          objectID,
          node,
          parentData,
          counter,
        )
        results.push(levelIndex)
        counter++

        // 更新当前节点的层级结构供子节点使用
        parentHierarchyMap.set(node, levelIndex.data)
      }

      // 渲染节点内容并创建内容索引
      const content = await TreeBuilder.renderNodeContent(
        node,
        this.options.vitepressConfig,
      )

      if (content) {
        const objectID = `${counter}-${context.url}`
        const contentIndex = builder.createContentIndex(
          objectID,
          content,
          node,
          parentData!,
          counter,
        )
        results.push(contentIndex)
        counter++

        // 如果没有标题但有内容，更新层级结构供子节点使用
        if (!node.title) {
          parentHierarchyMap.set(node, contentIndex.data)
        }
      }
    }

    return results
  }
}
