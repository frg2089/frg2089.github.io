import { defineUserConfig, } from "vuepress";
import { getDirname, path } from "@vuepress/utils";
import theme from "./vuepress.theme";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "岛风窝",
      description: "岛风的博客站",
    },
  },

  temp: '.temp',
  cache: '.cache',
  public: 'public',
  dest: 'dist',

  theme,

  templateBuild: 'index.html',

  shouldPrefetch: false,

  alias: {
    "@theme-hope/components/MarkdownContent": path.resolve(__dirname, 'src', 'components', 'MarkdownContent', 'index.vue'),
    "@theme-hope/modules/blog/components/InfoList": path.resolve(__dirname, 'src', 'components', 'InfoList', 'index.ts'),
  }
});
