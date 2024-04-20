import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import remarkHeadingId from "remark-heading-id";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";

function smallRemarkAdapter() {
  return function (tree) {
    visit(tree, function (node) {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        node.data = node.data || {};
        node.data.hName = node.type;
        node.data.hProperties = {
          directive: node.name,
          ...(node.attributes || {}),
        };
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx({
      syntaxHighlight: false,
      remarkPlugins: [remarkDirective, smallRemarkAdapter, remarkHeadingId],
    }),
  ],
});
