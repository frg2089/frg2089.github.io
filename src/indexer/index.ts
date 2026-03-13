import { algoliasearch } from 'algoliasearch'
import matter from 'gray-matter'
import * as fs from 'node:fs'
import * as path from 'node:path'

const run = async (
  options: Crawler.CrawlerOptions,
  apiKey: string,
  dryRun: boolean,
) => {
  const src = path.resolve(options.src)
  const baseUrl = new URL(`https://${options.host}`)

  const relativePaths = await fs.promises
    .readdir(src, { recursive: true })
    .then(i => i.filter(i => path.extname(i).toLowerCase() === '.md'))

  const indexes = await Promise.all(
    relativePaths.map(async relativePath => {
      const absolutePath = path.resolve(src, relativePath)
      const url = (() => {
        let path =
          relativePath
            .substring(0, relativePath.length - 2)
            .replaceAll('\\', '/') + 'html'

        if (path.endsWith('index.html')) {
          path = path.substring(0, path.length - 10)
        }

        return new URL(path, baseUrl).href
      })()

      const raw = await fs.promises.readFile(absolutePath, {
        encoding: 'utf-8',
        flag: 'r',
      })

      const gm = matter(raw)

      const context: Crawler.PageContext = {
        relativePath,
        absolutePath,
        url,
        frontmatter: gm.data,
        content: gm.content,
      }

      return await Promise.all(
        options.processors.map(async i => {
          const processor = await i
          const index = await processor(context)
          return Array.isArray(index) ? index : [index]
        }),
      )
    }),
  )

  const indices = indexes
    .flat()
    .flat()
    .filter(i => !!i)
    .reduce(
      (a, b) => {
        a[b.name] ??= []
        a[b.name].push(b.data)
        return a
      },
      {} as Record<string, Crawler.IndexData[]>,
    )

  if (dryRun) {
    console.info(JSON.stringify(indices, null, 2))
    return
  }

  const client = algoliasearch(options.appId, apiKey)

  const responses = await Promise.all(
    Object.entries(indices).map(async ([indexName, indexes]) => {
      await client.clearObjects({ indexName })
      return await Promise.all(
        indexes.map(
          async index =>
            await client.addOrUpdateObject({
              indexName,
              objectID: index.objectID,
              body: index,
            }),
        ),
      )
    }),
  )

  return responses.flat()
}

export default run
