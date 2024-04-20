# Testing override for markdown with components

Testing how different overrides work in Astro:

- [ ] [remark-directive](https://github.com/remarkjs/remark-directive)
- [ ] Code - doesn't work as expected
  - [ ] `inline` not passed - no way to distinguish inline-code and block-code
    - had to do hack with `props.class === undefined`
  - [ ] `lang` not passed
    - had to do hack with `class?.replace("language-", "")`
  - [ ] block-code get's wrapped in extra `pre`
    - had to do hack with overriding `pre` and render it witout extra
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

## Docs

List of components that MDX supports out of the box https://mdxjs.com/table-of-components/

Astro integration https://docs.astro.build/en/guides/integrations-guide/mdx/
