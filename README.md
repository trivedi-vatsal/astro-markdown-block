# astro-markdown-block

[![npm version](https://img.shields.io/npm/v/astro-markdown-block)](https://www.npmjs.com/package/astro-markdown-block)
[![license](https://img.shields.io/npm/l/astro-markdown-block)](https://github.com/trivedi-vatsal/astro-markdown-block/blob/main/LICENSE)
[![types](https://img.shields.io/badge/types-included-blue)](https://vatsal.xyz/astro-markdown-block/api/)

A Markdown block for Astro and React. Readers see the rendered Markdown, flip to the raw source, and copy it in one click. Good for prompts, READMEs, and snippets people paste somewhere else.

**[Demo](https://vatsal.xyz/astro-markdown-block/)** · **[Playground](https://vatsal.xyz/astro-markdown-block/playground/)** · **[Examples](https://vatsal.xyz/astro-markdown-block/examples/)** · **[API](https://vatsal.xyz/astro-markdown-block/api/)**

![The same block in preview mode and in Markdown mode](https://raw.githubusercontent.com/trivedi-vatsal/astro-markdown-block/main/.github/preview.png)

## Features

- Rendered preview and raw source in one block
- One-click copy of the original Markdown
- GitHub Flavored Markdown: tables, task lists, strikethrough
- Light and dark mode, restyled with CSS variables. No Tailwind needed
- Your own remark and rehype plugins and custom renderers
- Works in `.astro`, `.mdx`, and any React 18+ app
- About 1.7 KB of JS and 1.4 KB of CSS gzipped, plus `react-markdown`

## Install

```sh
npm install astro-markdown-block
npx astro add react   # Astro only
```

## Usage

### Astro and MDX

```astro
---
import { MarkdownBlock } from 'astro-markdown-block'
import 'astro-markdown-block/styles.css'
import notes from './notes.md?raw'
---

<MarkdownBlock client:visible title="Notes" source={notes} />
```

`?raw` loads the file as a string. `client:visible` turns on the buttons when the block scrolls into view. In `.mdx`, use the same imports without the `---` fences.

### React

```tsx
import { MarkdownBlock } from 'astro-markdown-block'
import 'astro-markdown-block/styles.css'

export function Notes({ source }: { source: string }) {
  return <MarkdownBlock title="Notes" source={source} />
}
```

## Props

| Prop            | Type                            | Default                      |
| --------------- | ------------------------------- | ---------------------------- |
| `source`        | `string`                        | required                     |
| `title`         | `string`                        |                              |
| `defaultMode`   | `'preview' \| 'markdown'`       | `'preview'`                  |
| `height`        | `string \| number`              | `'24rem'`                    |
| `remarkPlugins` | `PluggableList`                 | `[remarkGfm]`                |
| `rehypePlugins` | `PluggableList`                 | external links in a new tab  |
| `components`    | `Components` (react-markdown)   |                              |
| `labels`        | `Partial<MarkdownBlockLabels>`  | Preview, Markdown, Copy, ... |
| `className`     | `string`                        |                              |
| `classNames`    | `Partial<Record<Part, string>>` |                              |

`Part` is one of `root`, `toolbar`, `title`, `actions`, `button`, `body`, `preview`, `source`.

Passing `remarkPlugins` or `rehypePlugins` replaces the defaults. To keep GFM, include `remark-gfm` in your list. Full descriptions are on the [API page](https://vatsal.xyz/astro-markdown-block/api/).

## Theming

Set `--amb-*` variables on a class and pass it as `className`:

```css
.brand {
  --amb-accent: #7c3aed;
  --amb-border: #ddd6fe;
  --amb-toolbar-bg: #f5f3ff;
  --amb-radius: 0.75rem;
}
```

```astro
<MarkdownBlock client:visible className="brand" source={notes} />
```

Dark mode follows `prefers-color-scheme`. If your site sets `.light`, `.dark`, or `data-theme` on `<html>`, the block follows that instead. Every variable is listed on the [API page](https://vatsal.xyz/astro-markdown-block/api/#variables).

Using Tailwind Typography? Pass `classNames={{ preview: 'prose dark:prose-invert' }}`.

## Development

```sh
pnpm install
pnpm site:dev   # builds the package, then runs the demo site
pnpm build      # package only
pnpm typecheck
```

Needs Node 22.23.4 or later (see `.nvmrc`). Pushing a `v*` tag publishes to npm through GitHub Actions.

## License

MIT
