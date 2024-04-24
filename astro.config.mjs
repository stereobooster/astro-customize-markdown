import { defineConfig } from "astro/config";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import remarkHeadingId from "remark-heading-id";
import remarkDirective from "remark-directive";
import { rehypePlugin } from "./src/plugins/expRehypePlugin.mjs";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), icon()],
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [remarkDirective, remarkHeadingId],
    rehypePlugins: [
      [
        rehypePlugin,
        {
          code: (props) => {
            // console.log(props);
            return new Promise((resolve) =>
              setTimeout(() => resolve(`<span>${props.language}</span>`), 500)
            );
            return `<span>${props.language}</span>`;
          },
        },
      ],
    ],
  },
});
