/**
 * @description 树节点类型，表示标题层级（0-6） 0 表示根节点，1-6 对应 markdown 的 # 到 ######
 */
export type Level = 0 | 1 | 2 | 3 | 4 | 5 | 6

/**
 * @description 文档树节点类 用于表示 markdown 文档的层级结构
 */
export class TreeNode {
  /**
   * @description 节点级别（0-6）
   */
  public readonly level: Level
  /**
   * @description 父节点
   */
  public parent?: TreeNode
  /**
   * @description 子节点列表
   */
  public children: TreeNode[] = []
  /**
   * @description 标题文本
   */
  public title?: string
  /**
   * @description 节点内容（非标题的文本行）
   */
  public content: string[] = []

  constructor(level: Level, parent?: TreeNode) {
    this.level = level
    this.parent = parent
  }

  /**
   * @description 添加子节点
   *
   * @param node - 子节点
   */
  public addChild(node: TreeNode): void {
    this.children.push(node)
    node.parent = this
  }

  /**
   * @description 添加内容行
   *
   * @param line - 文本行
   */
  public addContent(line: string): void {
    this.content.push(line)
  }
}
