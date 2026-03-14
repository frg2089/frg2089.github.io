import { program } from 'commander'
import * as path from 'node:path'
import * as util from 'node:util'
import { content } from './content/index'
import type { PageContext } from './indexer'
import indexer from './indexer'
import { markdown } from './markdown/index'

util.inspect.defaultOptions.depth = 5

const DIR_NAME_MAP = {
  posts: '文章',
  bookmarks: '书签',
  tools: '工具',
} as const

const getLvl0 = (context: PageContext): string => {
  const base = context.relativePath.split(path.sep, 2)[0]
  return DIR_NAME_MAP[base as keyof typeof DIR_NAME_MAP] ?? '岛风的档案室'
}

program
  .option('-k, --api-key <apiKey>', 'Algolia API key')
  .option('--dry-run', 'Run in dry run mode')

await program.parseAsync()

const options = program.opts()

await indexer({
  appId: 'L43QG2V2U8',
  host: 'blog.shimakaze.dev',
  src: 'docs',
  apiKey: options.apiKey,
  dryRun: options.dryRun,
  processors: [
    markdown({
      indexName: 'shimakaze-markdown',
      lang: 'zh-CN',
    }),
    content({
      vitepressConfig: '.vitepress/config.ts',
      indexName: 'shimakaze',
      lang: 'zh-CN',
      lvl0: getLvl0,
    }),
  ],
})
