# astro-markdown-block

A Markdown block for Astro and React. Readers switch between the rendered preview and the raw source, turn word wrap on or off, and copy the Markdown exactly as written.

## Install

```sh
npm install astro-markdown-block
npx astro add react
```

Astro needs the React integration. The buttons need a `client:*` directive.

## What you get

- Preview and raw source in one block
- Copy, with a fallback when the Clipboard API is missing
- GitHub-flavored Markdown
- CSS variables for light and dark mode
