import { computed, defineComponent, h, ref } from "vue";
import { RouterLink } from "vue-router";

import CategoryList from "@theme-hope/modules/blog/components/CategoryList";
import DropTransition from "@theme-hope/components/transitions/DropTransition";
import TagList from "@theme-hope/modules/blog/components/TagList";
import TimelineList from "@theme-hope/modules/blog/components/TimelineList";
import {
  ArticleIcon,
  CategoryIcon,
  TagIcon,
  TimelineIcon,
  LinkIcon,
} from "@theme-hope/modules/blog/components/icons/index";

import { useNavigate, useThemeLocaleData } from "@theme-hope/composables/index";
import {
  useArticles,
  useBlogOptions,
  useCategoryMap,
  useStars,
  useTagMap,
} from "@theme-hope/modules/blog/composables/index";

import type { FunctionalComponent, VNode } from "vue";

import "./info-list.scss";

const css = (template: TemplateStringsArray, ...args: string[]) => template.reduce((r, s, i) => r + (args[i] ?? '') + s, '');

const FriendList = defineComponent({
  name: 'FriendList',
  setup() {
    const config = useBlogOptions()

    return (): VNode => h(
      'div',
      null,
      config.value.friends.map(i => h(
        'a',
        {
          href: i.link,
        },
        [
          h(
            'div',
            {
              class: 'blogger-info',
              style: css`
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0.25rem;
              `,
            },
            [
              h(
                'img',
                {

                  class: [
                    "blogger-avatar",
                    { round: config.value.roundAvatar },
                  ],
                  property: "image",
                  src: i.logo,
                  alt: i.name,
                  style: css`
                    width: 3rem;
                    height: 3rem;
                  `,
                }
              ),
              h(
                'div',
                {
                  style: css`
                    flex-grow: 1;
                    margin-left: 0.5rem;
                  `
                },
                [
                  h(
                    'span',
                    null,
                    [i.name]
                  ),
                  h('br'),
                  h(
                    'span',
                    {
                      style: css`
                        font-size: 0.75rem;
                        color: var(--text-color);
                      `
                    },
                    [i.desc]
                  ),
                ]
              )
            ])
        ])
      )
    )
  }
})

export default defineComponent({
  name: "InfoList",

  setup() {
    const themeLocale = useThemeLocaleData();
    const articles = useArticles();
    const categoryMap = useCategoryMap();
    const categoryNumber = computed(
      () => Object.keys(categoryMap.value.map).length
    );
    const stars = useStars();
    const tagMap = useTagMap();
    const tagNumber = computed(() => Object.keys(tagMap.value.map).length);
    const navigate = useNavigate();

    const active = ref("article");

    const locale = computed(() => themeLocale.value.blogLocales);

    const buttons: [
      "article" | "category" | "tag" | "timeline" | "friends",
      FunctionalComponent
    ][] = [
        ["article", ArticleIcon],
        ["category", CategoryIcon],
        ["tag", TagIcon],
        ["timeline", TimelineIcon],
        ["friends", LinkIcon],
      ];

    return (): VNode =>
      h("div", { class: "blog-info-list" }, [
        h(
          "div",
          { class: "blog-type-wrapper" },
          buttons.map(([key, icon]) =>
            h(
              "button",
              {
                class: "blog-type-button",
                onClick: () => {
                  active.value = key;
                },
              },
              h(
                "div",
                {
                  class: ["icon-wrapper", { active: active.value === key }],
                  "aria-label": locale.value[key],
                  "data-balloon-pos": "up",
                },
                h(icon)
              )
            )
          )
        ),

        // article
        active.value === "article"
          ? h(DropTransition, () => [
            h("div", { class: "sticky-article-wrapper" }, [
              h(
                "div",
                {
                  class: "title",
                  onClick: () => navigate(articles.value.path),
                },
                [
                  h(ArticleIcon),
                  h("span", { class: "num" }, articles.value.items.length),
                  locale.value.article,
                ]
              ),
              h("hr"),
              h(
                "ul",
                { class: "sticky-article-list" },
                // @ts-ignore
                stars.value.items.map(({ info, path }, index) =>
                  h(
                    DropTransition,
                    { appear: true, delay: 0.08 * (index + 1) },
                    () =>
                      h(
                        "li",
                        { class: "sticky-article" },
                        h(RouterLink, { to: path }, () => info.title)
                      )
                  )
                )
              ),
            ]),
          ])
          : null,

        // category
        active.value === "category"
          ? h(DropTransition, () => [
            h("div", { class: "category-wrapper" }, [
              categoryNumber.value
                ? h(
                  "div",
                  {
                    class: "title",
                    onClick: () => navigate(categoryMap.value.path),
                  },
                  [
                    h(CategoryIcon),
                    h("span", { class: "num" }, categoryNumber.value),
                    locale.value.category,
                  ]
                )
                : null,
              h("hr"),
              h(DropTransition, { delay: 0.04 }, () => h(CategoryList)),
            ]),
          ])
          : null,

        // tag
        active.value === "tag"
          ? h(DropTransition, () => [
            h("div", { class: "tag-wrapper" }, [
              tagNumber.value
                ? h(
                  "div",
                  {
                    class: "title",
                    onClick: () => navigate(tagMap.value.path),
                  },
                  [
                    h(TagIcon),
                    h("span", { class: "num" }, tagNumber.value),
                    locale.value.tag,
                  ]
                )
                : null,
              h("hr"),
              h(DropTransition, { delay: 0.04 }, () => h(TagList)),
            ]),
          ])
          : null,

        // timeline
        active.value === "timeline"
          ? h(DropTransition, () => h(TimelineList))
          : null,

        // friends
        active.value === "friends"
          ? h(DropTransition, () => h(FriendList))
          : null,
      ]);
  },
});