# astro-markdown-block

A Markdown block for Astro and React. Readers switch between the rendered preview and the raw source, turn word wrap on or off, and copy the Markdown exactly as written. Good for prompts, templates, and snippets people are meant to paste somewhere else.

**Demo and docs:** https://vatsal.xyz/astro-markdown-block/

- Preview and raw source in one block, with a toggle
- Copy button with a fallback for browsers without the Clipboard API
- GitHub-flavored Markdown (tables, task lists, strikethrough, bare links)
- External links open in a new tab with `noopener noreferrer`
- Plain CSS with CSS variables. No Tailwind needed, and it handles light and dark mode
- About 1.7 KB gzipped JS and 1.4 KB gzipped CSS, plus `react-markdown`

## Install

```sh
npm install astro-markdown-block
npx astro add react
```

It's a React component, so Astro needs the `@astrojs/react` integration.

## Usage

Import the Markdown with `?raw` to get the file as a string:

```mdx
import { MarkdownBlock } from 'astro-markdown-block'
import 'astro-markdown-block/styles.css'
import prompt from './prompt.md?raw'

<MarkdownBlock client:visible title="Prompt" source={prompt} />
```

The buttons need a `client:*` directive to work. `client:visible` is the cheapest one for blocks below the fold.

It works the same in `.astro` files and in any React app.

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

Passing `remarkPlugins` or `rehypePlugins` replaces the defaults. To keep GFM, include `remark-gfm` in your list.

## Theming

Set any `--amb-*` variable on a class and pass it as `className`:

```css
.brand {
  --amb-accent: #7c3aed;
  --amb-border: #ddd6fe;
  --amb-toolbar-bg: #f5f3ff;
  --amb-radius: 0.75rem;
}
```

Variables: `--amb-bg`, `--amb-fg`, `--amb-muted`, `--amb-border`, `--amb-toolbar-bg`, `--amb-button-bg`, `--amb-button-hover`, `--amb-accent`, `--amb-accent-fg`, `--amb-code-bg`, `--amb-link`, `--amb-radius`, `--amb-font-sans`, `--amb-font-mono`.

Dark mode follows `prefers-color-scheme`. If your site toggles a `.light`/`.dark` class or a `data-theme` attribute on `<html>`, the block follows that instead.

Using Tailwind Typography? Style the preview with it instead:

```tsx
<MarkdownBlock
  source={source}
  classNames={{ preview: 'prose dark:prose-invert' }}
/>
```

## Development

```sh
pnpm install
pnpm site:dev     # builds the package, then runs the demo site
pnpm build        # package only
pnpm typecheck
```

Requires Node 22.23.4 or later (see `.nvmrc`).

## Publishing

The first release has to be published from a machine that is logged in to npm, because npm will not create a brand new package from GitHub Actions:

```sh
npm login
npm publish
```

After that, open the package on npmjs.com, go to Settings, Trusted Publisher, and allow `.github/workflows/publish.yml` from `trivedi-vatsal/astro-markdown-block`. Later releases are `git tag v0.2.0 && git push origin v0.2.0`.

## License

MIT
