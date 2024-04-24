import { defineConfig } from "astro/config";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import remarkHeadingId from "remark-heading-id";
import remarkDirective from "remark-directive";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), icon()],
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [remarkDirective, remarkHeadingId],
  },
});
