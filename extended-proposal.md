# Allow to override markdown with Astro components

This is extended version of [original proposal](https://github.com/withastro/roadmap/discussions/769).

## Introduction

Idea is very similar to [Hugo render hooks](https://gohugo.io/render-hooks/). Add ability to custmoize how markdown is rendered with Astro components:

```astro
---
// ...
const { Content } = await post.render();
---

<Content
  components={{
    h1: Heading1,
    a: Link,
  }}
/>
```

## Motivating examples

### Reuse components

If one already has Astro component it would be trivial to reuse it in markdown. For example, Starlight provides [`<Aside />` component](https://github.com/withastro/starlight/blob/main/packages/starlight/user-components/Aside.astro). There would be no need to [reimplement the same component as remark/rehype plugin](https://github.com/withastro/starlight/blob/main/packages/starlight/integrations/asides.ts).

Instead one could do:

```astro
// ContainerDirective.astro
---
import Aside from "./Aside.astro";
---
<Aside type={Astro.props.directive}>
  <slot />
</Aside>
```

and then

```astro
<Content
  components={{
    containerdirective: ContainerDirective,
  }}
/>
```

### Astro components are easier to deal with than remark/rehype plugins

Remark and rehype provide low level API, which is nice if you develop plugins, but for the end-users this causes a lot of confusion.

Situation is very similar to Vite API. It is overkill for Astro integration layer. That is why there is [Astro Integration Kit](https://github.com/withastro/roadmap/discussions/886), which creates additional layer tailored speciafically for Astro use case.

Take a look [how much struggle it is to integrate Mermaid in Astro/Starlight](https://github.com/withastro/starlight/discussions/1259).

On the other hand with proposed API it would be a trivial task:

```astro
// CodeOverride.astro
---
import { Code } from "astro:components";
import Mermaid from "./Mermaid.astro";
const { content, lang, inline } = Astro.props;
---
{
  lang === "mermaid" ? (
    <Mermaid diagram={content} />
  ) : (
    <Code code={content} lang={lang} inline={inline} />
  )
}
```

and then

```astro
<Content
  components={{
    code: CodeOverride,
  }}
/>
```

### Astro components can be client-side components

This API opens up door to for using client-side components for Markdown, which would be hard to do with remark/rehype plugins.

For example, one can override code-fences to render Google Maps in place.

````md
```map
38.7223° N, 9.1393° W
```
````

With something like this:

```astro
// CodeOverride.astro
---
import { Code } from "astro:components";
import GoogleMaps from "./GoogleMaps.astro";
const { content, lang, inline } = Astro.props;
---
{
  lang === "map" ? (
    <GoogleMaps center={content} />
  ) : (
    <Code code={content} lang={lang} inline={inline} />
  )
}
```

Or if you have [remark-directive](https://github.com/remarkjs/remark-directive), you can use special directive for this, for example:

```md
::map[38.7223° N, 9.1393° W]
```

## The devil is in the details

While all of this sounds nice, it may be not very clear how to design API.

### At which level shall it operate - `mdast` or `hast`?

Let's imagine ideal interface for `Code` Astro component:

```astro
---
type Props = {
  content: string;
  inline: boolean;
  lang?: string;
  metastring?: string;
};
---
```

Which in case of given example:

````md
```ts {1}
const x = 1;
```
````

would be passed as:

```json
{
  "content": "const x = 1;",
  "inline": false,
  "lang": "ts",
  "metastring": "{1}"
}
```

This is pretty easy at `mdast` level. But at `hast` level we don't have concept of `code-fence`, instead there is `<pre><code class="languages-ts">const x = 1;</code></pre>`.

Which means that in order for Astro to support "ideal" interface it would either need to:

- use `mdast`
  - **problem:** some plugins work at `hast` level, for example `rehype-slug`, which adds ids to headings
- or write custom handlers for each case for `hast`

### Problem with `<slot />`

Let's take the same `Code` component example from above.

More traditional way to get content would be: `const content = await Astro.slots.render("default");`. Instead of passing it as prop.

But the problem here is that content gets processed (html entities escaped, markdown gets processed). So for:

````md
```html
<h1>hi</h1>
```
````

`await Astro.slots.render("default");` would produce `&lt;h1&gt;hi&lt;/h1&gt;`.

### Problem with nested markdown

Let's say we want to override `Blockquote` in order to implement callouts similar to Github:

```md
> [!NOTE]
> something
```

And Blockquote component is something like this:

```astro
---
import Aside from "./Aside.astro";

type Props = {
  content: string;
};

let content = Astro.props.content;
const matches = content.trim().match(/^[!([^\]]*)\]/);
const aside = Boolean(matches);
let type = "note" as any;
if (matches) {
  type = matches[1].toLowerCase();
  content = content.replace(matches[0], "");
}
---

{
  aside ? (
    <Aside type={type}>
      <Markdown content={content}>
    </Aside>
  ) : (
    <blockquote>
      <Markdown content={content}>
    </blockquote>
  )
}
```

If we pass "raw" string to content we would also need some kind of `<Markdown />` component. There is [deprecated (AFAIK) componet for this](https://www.npmjs.com/package/@astrojs/markdown-component).

### What is allowed in Astro components?

Astro component in the context of this proposal can imply different expectations (requirements).

Simplest case: it renders self-contained HTML string. For example, SVG (from Mermaid), syntax-highlighting (like current Shiki plugin), etc.

Harder case: it also has JavaScript and Style blocks. In this case they need to be deduplicated - e.g. even if component rendered multiple times JavaScript and Style should be outputed only ones.

Simplest case probably can be implemented in the "user-space" with something, like [`await astro.renderToString(Component, { props, slots, request, params })`](https://github.com/withastro/roadmap/issues/533).

### MDX compatibility

Is it expected that overrides for Markdown would also work for MDX? Is MDX overrides would stay the same or would they change?

On one side, if we can mix markdown and MDX in [Content Collections](https://docs.astro.build/en/guides/content-collections/) - it is expected that they would work the same.

On the other side if one already uses MDX they can use it for all files. And treatment of MD and MDX files can be different. For example:

```astro
<Content
  components={{}}
  componentsMDX={{}}
/>
```

If components for MD would work the same way as MDX, they would inherit the same problems as described in [astro-customize-markdown](https://github.com/stereobooster/astro-customize-markdown).

If current MDX overrides are good enough for your use case, you can rename all files from `.md` to `.mdx`.
