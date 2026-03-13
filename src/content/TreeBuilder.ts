import { Parser } from 'htmlparser2'
import * as path from 'node:path'
import * as Url from 'node:url'
import type { MarkdownRenderer } from 'vitepress'
import { createMarkdownRenderer } from 'vitepress'
import { Level, TreeNode } from './TreeNode'

/**
 * 文档树构建器
 * 将 markdown 内容解析为树结构，并渲染为纯文本
 */
export class TreeBuilder {
  /** Markdown 渲染器实例（单例） */
  private static md: MarkdownRenderer | null = null

  /**
   * 获取 VitePress Markdown 渲染器
   * @param vitepressConfig - VitePress 配置文件路径
   * @returns Markdown 渲染器实例
   */
  private static async getRenderer(
    vitepressConfig: string,
  ): Promise<MarkdownRenderer> {
    if (this.md) return this.md

    const configPath = Url.pathToFileURL(path.resolve(vitepressConfig)).href
    const config = await import(configPath)

    this.md = await createMarkdownRenderer(
      config.srcDir,
      config.markdown,
      config.site?.base,
      config.logger,
    )

    return this.md
  }

  /**
   * 从 HTML 中提取纯文本
   * @param html - HTML 字符串
   * @returns 纯文本
   */
  private static extractHtmlText(html: string): string {
    const textParts: string[] = []

    const parser = new Parser({
      ontext(text) {
        textParts.push(text)
      },
    })

    parser.write(html)
    parser.end()
    return textParts.join('')
  }

  /**
   * 渲染 markdown 内容为纯文本
   * @param content - markdown 内容数组
   * @param vitepressConfig - VitePress 配置文件路径
   * @returns 渲染后的纯文本
   */
  private static async renderContent(
    content: string[],
    vitepressConfig: string,
  ): Promise<string | undefined> {
    if (content.length === 0) return undefined

    const md = await this.getRenderer(vitepressConfig)
    const html = md.render(content.join('\r\n'))
    return this.extractHtmlText(html)
  }

  /**
   * 解析标题级别
   * @param line - 文本行
   * @returns 标题级别（0-6）
   */
  private static getLevel(line: string): Level {
    const match = line.match(/^#{1,6}\s/)
    if (!match) return 0

    return Math.min(match[0].length - 1, 6) as Level
  }

  /**
   * 从标题行中提取标题文本
   * @param line - 标题行
   * @returns 标题文本
   */
  private static getTitle(line: string): string {
    const space = line.indexOf(' ')
    return line.substring(space + 1).trim()
  }

  /**
   * 将 markdown 内容解析为树结构
   * @param content - markdown 内容
   * @returns 根节点
   */
  public static buildTree(content: string): TreeNode {
    const root = new TreeNode(0)
    const lines = content.split(/\r?\n|\r/)
    let current = root
    let inCodeBlock = false

    for (const line of lines) {
      // 检测代码块边界
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock
      }

      // 代码块中的内容作为普通文本处理
      if (inCodeBlock) {
        current.addContent(line)
        continue
      }

      const level = this.getLevel(line)

      // 处理标题
      if (level > 0) {
        const title = this.getTitle(line)

        // 回退到合适的父级
        while (level < current.level) {
          current = current.parent!
        }

        // 创建新节点
        while (level > current.level) {
          const parent = current
          const newLevel = Math.min(parent.level + 1, 6) as Level
          current = new TreeNode(newLevel, parent)
          parent.addChild(current)
        }

        // 同级标题，切换到同级的新节点
        const parent = current.parent ?? root
        const newLevel = Math.min(parent.level + 1, 6) as Level
        current = new TreeNode(newLevel, parent)
        parent.addChild(current)
        current.title = title
      } else {
        // 普通内容添加到当前节点
        current.addContent(line)
      }
    }

    return root
  }

  /**
   * 渲染树节点的内容
   * @param node - 树节点
   * @param vitepressConfig - VitePress 配置文件路径
   * @returns 渲染后的纯文本
   */
  public static async renderNodeContent(
    node: TreeNode,
    vitepressConfig: string,
  ): Promise<string | undefined> {
    return this.renderContent(node.content, vitepressConfig)
  }
}
