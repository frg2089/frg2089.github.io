import { program } from 'commander'
import * as path from 'node:path'
import { content } from './content'
import crawler from './indexer'
import { markdown } from './markdown'

program
  .option('-k, --api-key <apiKey>', 'algolia write key')
  .option('--dry-run', 'algolia write key')

await program.parseAsync()

const options = program.opts()

await crawler(
  {
    appId: 'L43QG2V2U8',
    host: 'blog.shimakaze.dev',
    src: 'docs',
    processors: [
      markdown({
        indexName: 'shimakaze-markdown',
        lang: 'zh-CN',
      }),
      content({
        vitepressConfig: '.vitepress/config.ts',
        indexName: 'shimakaze',
        lang: 'zh-CN',
        lvl0: context => {
          const base = context.relativePath.split(path.sep, 2)[0]
          const result =
            {
              posts: '文章',
              bookmarks: '书签',
              tools: '工具',
            }[base] ?? '岛风的档案室'

          return result
        },
      }),
    ],
  },
  options.apiKey,
  options.dryRun,
)
