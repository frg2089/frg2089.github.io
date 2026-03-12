import { program } from 'commander'
import crawler from './crawler'
import { markdown } from './markdown'

program.option('-k, --api-key <apiKey>', 'algolia write key')

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
    ],
  },
  options.apiKey,
)
