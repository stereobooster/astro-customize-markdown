# Testing override for MDX with components

Testing how different overrides work in Astro:

- [ ] Code - doesn't work as expected
  - [ ] `inline` not passed - no way to distinguish inline-code and block-code
    - had to do hack with `props.class === undefined`
  - [ ] `lang` not passed
    - had to do hack with `class?.replace("language-", "")`
  - [ ] block-code get's wrapped in extra `pre`
    - had to do hack with overriding `pre` and render it witout tag
  - [ ] `<slot />` - content is HTML string, which means that one needs to unescape it
    - is there a way to use something like `allowDangerousHTML` to pass raw strings to some nodes?
  - [x] `metastring`
- [x] [remark-directive](https://github.com/remarkjs/remark-directive)
  - works if you add `smallRemarkAdapter`, then `leafdirective`, `containerdirective` and `textdirective` can be handled with MDX overrides
- [x] Image - works as expected
  - [x] `src`
  - [x] `alt`
  - [x] `title`
- [x] Link - works as expected
  - [x] `href`
  - [x] `title`
  - [x] `<slot />`
- [x] Blockquote
  - [x] `<slot />`
    - content is HTML string though
- [x] Heading
  - [x] `id`
  - [x] `<slot />`
  - [x] `{#custom-id}` (works with remark plugin)
    - `remark-custom-heading-id` didn't work in my case
    - `remark-heading-id` works, but in MDX one needs to escape curly-braces `\{#custom-id\}`
    - see https://github.com/withastro/roadmap/discussions/329

## Inspiration

Currently overrides only supported for MDX, but not for markdown. [There is a proposal to support component overrides for markdown as well](https://github.com/withastro/roadmap/discussions/769).

Ideally it should be as easy as [Hugo render hooks](https://gohugo.io/render-hooks/).

## Why does it matter?

### Case study 1: Aside in Starlight

Starlight provides [`<Aside />` component](https://github.com/withastro/starlight/blob/main/packages/starlight/user-components/Aside.astro).

Also it provides [markdown support for it](https://github.com/withastro/starlight/blob/main/packages/starlight/integrations/asides.ts):

```md
:::note
Highlights information that users should take into account, even when skimming.
:::
```

They basically duplicate code: once it is written as remark plugin and once it is written as Astro component.

Instead they can reuse it like this:

```astro
<Aside type={directive}>
  <slot />
</Aside>
```

### Case study 2: Code in Starlight

Astro provides [`<Code />` component](https://docs.astro.build/en/reference/api-reference/#code-).

Also it provides markdown support for it:

````md
```ts
const x = 1;
```
````

They basically duplicate code: once it is written as remark plugin and once it is written as Astro component.

**Plus**: if you want to customize it, for example, to add [Mermaid support](https://github.com/withastro/starlight/discussions/1259) you need to jump through hoops to undo what built-in syntax highlighter does.

Instead they can reuse components like this:

```astro
{
  lang === "mermaid" ? (
    <Mermaid diagram={code} />
  ) : (
    <Code code={code} lang={lang} inline={inline} />
  )
}
```

Other potential use cases:

- [Code Hike](https://codehike.org/)
  - [codehike#255](https://github.com/code-hike/codehike/issues/255)
  - [withastro/discussions#470](https://github.com/withastro/roadmap/discussions/470)
- [Shiki-Twoslash](https://shikijs.github.io/twoslash/)
  - [starlight/discussions#1381](https://github.com/withastro/starlight/discussions/1381)
- [Sandpack](https://sandpack.codesandbox.io/)
  - [A World-Class Code Playground with Sandpack](https://www.joshwcomeau.com/react/next-level-playground/)
- [starry-night](https://github.com/wooorm/starry-night)

### Case study 3: Heading

You may want to add anchors to headings. There is already rehype plugin for this - `rehype-autolink-headings`. But this requires [quite some configuration in different places](https://astro-digital-garden.stereobooster.com/recipes/anchors-for-headings/).

On the other hand overriding component [encapsulates all logic in one place](src/components/H2Override.astro).

### Case study 4: Link

You may want to add icons to external links or `target="_blank"` or `rel="nofollow"`. There is already rehype plugin for this - `rehype-external-links`. But this requires [quite some configuration in different places](https://astro-digital-garden.stereobooster.com/recipes/icons-to-external-links/).

On the other hand overriding component [encapsulates all logic in one place](src/components/LinkOverride.astro).

### Case study 5: remark-directive

`remark-directive` allows to create shortcuts for components, for example, one can create:

- `:youtube{#TtRtkTzHVBU}` to use `astro-embed` YouTube component. See [TextDirective](src/components/TextDirective.astro)
- `:icon{mdi:account}` to use `astro-icon` Icon component
- `:::tip` to use `Aside` component (see above). See [ContainerDirective](src/components/ContainerDirective.astro)

## Ideas

One can implement remark/rehype plugin and use [`await astro.renderToString(Component, { props, slots, request, params })`](https://github.com/withastro/roadmap/issues/533) to render components.
