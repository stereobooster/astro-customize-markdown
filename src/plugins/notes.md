## TODO

implement cases for:

- [ ] code
- [ ] img
  - url, alt, title
- [ ] link
  - href, content (which can be html)
- [ ] header
  - level, id, content  (which can be html)


## Notes

https://github.com/syntax-tree/unist-util-visit
https://github.com/syntax-tree/unist-util-modify-children
https://github.com/syntax-tree/unist-util-is
https://www.npmjs.com/package/unist-util-visit-parents

```
| ........................ process ........................... |
| .......... parse ... | ... run ... | ... stringify ..........|

          +--------+                     +----------+
Input ->- | Parser | ->- Syntax Tree ->- | Compiler | ->- Output
          +--------+          |          +----------+
                              X
                              |
                       +--------------+
                       | Transformers |
                       +--------------+
```

- process phase can be async, other pahses are sync

Most interesting for callbacks:

|                   | remark | rehype |
| ----------------- | ------ | ------ |
| code              | +      | +      |
| img               | +      | +      |
| link              | +      | +      |
| header            | +      | +      |
| remark directives | +      | ?      |
| wikilink          | +      |        |

- bloquote?

Ideally I only pass relavant props and don't pass nodes, but then how to support cases:

- for code and we basically need to replace whole block
- for header and link we may need to update params or insert siblings
