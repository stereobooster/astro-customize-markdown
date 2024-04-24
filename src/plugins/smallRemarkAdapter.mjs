import { visit } from "unist-util-visit";

export function smallRemarkAdapter() {
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
