import { ElementType, parseDocument } from 'htmlparser2'
import type { HeadConfig } from 'vuepress'

const html = (
  template: TemplateStringsArray,
  ...args: string[]
): ReturnType<typeof parseDocument> => {
  let result = template[0]
  for (let i = 1; i < template.length; i++) {
    result += args[i - 1]
    result += template[i]
  }
  return parseDocument(result)
}

const document = html`
  <link rel="preconnect" crossorigin href="https://cravatar.cn/" />
  <link rel="preconnect" crossorigin href="https://www.clarity.ms/" />
  <link rel="preconnect" crossorigin href="https://l.clarity.ms/" />
  <link rel="preconnect" crossorigin href="https://licensebuttons.net/" />
  <link rel="dns-prefetch" href="https://cravatar.cn/" />
  <link rel="dns-prefetch" href="https://licensebuttons.net/" />
  <link rel="dns-prefetch" href="https://www.clarity.ms/" />
  <link rel="dns-prefetch" href="https://l.clarity.ms/" />
  <script type="text/javascript">
    ;(function (c, l, a, r, i, t, y) {
      c[a] =
        c[a] ||
        function () {
          ;(c[a].q = c[a].q || []).push(arguments)
        }
      t = l.createElement(r)
      t.async = 1
      t.src = 'https://www.clarity.ms/tag/' + i
      y = l.getElementsByTagName(r)[0]
      y.parentNode.insertBefore(t, y)
    })(window, document, 'clarity', 'script', 'ob7z8cjggb')
  </script>
  <!-- Google tag (gtag.js) -->
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-JQ5QWRZZHH"></script>
  <script>
    window.dataLayer = window.dataLayer || []
    function gtag() {
      dataLayer.push(arguments)
    }
    gtag('js', new Date())

    gtag('config', 'G-JQ5QWRZZHH')
  </script>
`

const elements = document.children.filter(i => 'name' in i && 'tagName' in i)

const head: HeadConfig[] = elements.map(i => {
  const tag = i.tagName
  const attributes = Object.fromEntries(
    i.attributes.map(({ name, value }) => [name, value === '' ? true : value]),
  )

  const context = i.children
    .filter(i => i.type === ElementType.Text)
    .map(i => i.data)
    .join('\n')
    .trim()

  return [tag, attributes, context]
}) as any
export default head
