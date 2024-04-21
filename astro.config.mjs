import { defineConfig } from "astro/config";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import rehypeShiki from "@shikijs/rehype";
import rehypeMermaid from "rehype-mermaid";
// import rehypeExpressiveCode from "rehype-expressive-code";
// import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  integrations: [
    // expressiveCode(),
    mdx({
      syntaxHighlight: false,
      rehypePlugins: [
        [
          rehypeMermaid,
          {
            // The default strategy is 'inline-svg'
            // strategy: 'img-png'
            // strategy: 'img-svg'
            // strategy: 'inline-svg'
            // strategy: 'pre-mermaid'
            strategy: "img-svg",
            dark: true,
          },
        ],
        // [
        //   rehypeExpressiveCode,
        //   {
        //     themes: ["github-dark", "github-light"],
        //   },
        // ],
        [
          rehypeShiki,
          {
            onError: (error) => console.log(error.message),
            // or `theme` for a single theme
            // theme: "nord",
            themes: {
              light: "github-light",
              dark: "github-dark",
            },
          },
        ],
      ],
    }),
    icon(),
  ],
});
