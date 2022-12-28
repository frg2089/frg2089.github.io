import { defineUserConfig, viteBundler } from "vuepress";
import theme from "./vuepress.theme";

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

  shouldPrefetch: false,
});
