# Testing override for markdown with components

Testing how different overrides work in Astro:

- [ ] Code - doesn't work as expected
  - [ ] `inline` not passed - no way to distinguish inline-code and block-code
    - had to do hack with `props.class === undefined`
  - [ ] `lang` not passed
    - had to do hack with `class?.replace("language-", "")`
  - [ ] block-code get's wrapped in extra `pre`
    - had to do hack with overriding `pre` and render it witout tag
  - [ ] `<slot />` - content is HTML string, which means that one needs to unescape it
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
- [x] Header
  - [x] `id`
  - [x] `<slot />`
  - [ ] `{#custom-id}` doesn't work, probably requires remark configuration

## Inspiration

Currently overrides only supported for MDX, but not for markdown. [There is a proposal to support component overrides for markdown as well](https://github.com/withastro/roadmap/discussions/769).

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

### Case study 3: Header

You may want to add anchors to headers. There is already rehype plugin for this - `rehype-autolink-headings`. But this requires [quite some configuration in different places](https://astro-digital-garden.stereobooster.com/recipes/anchors-for-headings/).

On the other hand overriding component [encapsulates all logic in one place](src/components/H2Override.astro).

### Case study 4: Link

You may want to add icons to external links or `target="_blank"` or `rel="nofollow"`. There is already rehype plugin for this - `rehype-external-links`. But this requires [quite some configuration in different places](https://astro-digital-garden.stereobooster.com/recipes/icons-to-external-links/).

On the other hand overriding component [encapsulates all logic in one place](src/components/LinkOverride.astro).

### Case study 5: remark-directive

`remark-directive` allows to create shortcuts for components, for example, one can create:

- `:youtube{#TtRtkTzHVBU}` to use `astro-embed` YouTube component
- `:::tip` to use `Aside` component (see above)
