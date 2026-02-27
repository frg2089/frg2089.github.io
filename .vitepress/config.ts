import { defineConfig } from 'vitepress'
import teekConfig from './theme'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: teekConfig,
  srcDir: 'docs',
  title: 'Shimakaze Blog',
  description: 'Shimakaze Blog',
})
