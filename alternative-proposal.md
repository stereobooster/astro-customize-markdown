# Alternative proposal

## Introduction

Idea is very similar to [Hugo render hooks](https://gohugo.io/render-hooks/). But in contrary to the initial proposal it doesn't involve Astro components, but instead it proposes to simplify working with remark/rehype plugins. It can be done through writing some kind API layer on top.

For example, [markdown-it](https://github.com/markdown-it/markdown-it) has much simpler API:

```ts
const markdownItInstance = markdownIt({
  highlight(value, lang) {
    return highlightToHtml(lang, value);
  },
});
```

So the idea is to create remark / rehype plugin which would expose those simple callbacks for most popular use-cases.

Input of callback can be specific to tags.

Output of callback can be:

- `undefined` - leave node as is
- `string | hast` - replace node with content
- `Promise<string | hast>` - replace node with content of the promise "resolution"
  - It seems that remark / rehype supports promises (but I need to verify this)
