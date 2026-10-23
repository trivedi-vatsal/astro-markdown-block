import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { gzipSync } from 'node:zlib'

type PackageJson = {
  name: string
  version: string
  license: string
  description: string
  type?: string
  bugs?: string | { url?: string }
  repository: { url: string }
  peerDependencies?: Record<string, string>
  dependencies?: Record<string, string>
  exports?: { '.'?: { types?: string } }
}

const root = resolve(process.cwd(), '..')
const pkg = JSON.parse(
  readFileSync(resolve(root, 'package.json'), 'utf8'),
) as PackageJson

function size(file: string) {
  const bytes = readFileSync(resolve(root, 'dist', file))
  const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`
  return `${kb(bytes.length)} (${kb(gzipSync(bytes).length)} gzip)`
}

function formatDeps(record: Record<string, string> | undefined) {
  const entries = Object.entries(record ?? {})
  if (entries.length === 0) return 'None'
  return entries.map(([name, range]) => `${name} ${range}`).join(', ')
}

export const siteTitle = `${pkg.name} — Interactive Markdown Viewer for Astro & React`
export const siteDescription =
  'Display rendered Markdown and raw source in Astro and React. Includes one-click copying, GitHub Flavored Markdown, theme customization, and extensible rendering.'

export const authorUrl = 'https://vatsal.xyz'
export const npmUrl = `https://www.npmjs.com/package/${pkg.name}`
export const repoUrl = pkg.repository.url
  .replace(/^git\+/, '')
  .replace(/\.git$/, '')
export const issuesUrl =
  typeof pkg.bugs === 'string'
    ? pkg.bugs
    : (pkg.bugs?.url ?? `${repoUrl}/issues`)
export const releasesUrl = `${repoUrl}/releases`
export const licenseUrl = `${repoUrl}/blob/main/LICENSE`

const reactPeer = pkg.peerDependencies?.react

export const pkgInfo = {
  name: pkg.name,
  version: pkg.version,
  license: pkg.license,
}

export const packageDetails = [
  ['Version', pkg.version],
  ['License', pkg.license],
  [
    'Compatibility',
    reactPeer
      ? `React ${reactPeer}, and Astro with @astrojs/react`
      : 'React, and Astro with @astrojs/react',
  ],
  ['Module format', pkg.type === 'module' ? 'ESM' : (pkg.type ?? 'Unknown')],
  [
    'TypeScript',
    pkg.exports?.['.']?.types ? 'Types included' : 'No types entry',
  ],
  ['Peer dependencies', formatDeps(pkg.peerDependencies)],
  ['Dependencies', formatDeps(pkg.dependencies)],
  ['JavaScript', size('index.js')],
  ['CSS', size('styles.css')],
] as const

export const apiProps = [
  ['source', 'string', '—', 'Required. The Markdown to render and to copy.'],
  ['title', 'string', '—', 'Optional label in the toolbar, before the mode.'],
  [
    'defaultMode',
    "'preview' | 'markdown'",
    "'preview'",
    'Which view shows first.',
  ],
  [
    'height',
    'string | number',
    "'24rem'",
    'Height of the scrolling body. A number is pixels.',
  ],
  [
    'remarkPlugins',
    'PluggableList',
    '[remarkGfm]',
    'Replaces the default remark plugins. The default is remark-gfm.',
  ],
  [
    'rehypePlugins',
    'PluggableList',
    'external links',
    'Replaces the default rehype plugins. The default opens external links in a new tab with rel="noopener noreferrer".',
  ],
  [
    'components',
    'Components',
    '—',
    'Custom element renderers, forwarded to react-markdown.',
  ],
  [
    'labels',
    'Partial<MarkdownBlockLabels>',
    'built-in',
    'Overrides any of preview, markdown, copy, copied, and wrap. Defaults: Preview, Markdown, Copy, Copied, Word wrap.',
  ],
  [
    'className',
    'string',
    '—',
    'Extra class on the root element, for theme variables or layout.',
  ],
  [
    'classNames',
    'Partial<Record<MarkdownBlockPart, string>>',
    '—',
    'Extra classes for root, toolbar, title, actions, button, body, preview, or source.',
  ],
] as const

export const cssVariables = [
  ['--amb-bg', 'Background of the block'],
  ['--amb-fg', 'Text color'],
  ['--amb-muted', 'Secondary text, such as the mode label'],
  ['--amb-border', 'Borders and table lines'],
  ['--amb-toolbar-bg', 'Toolbar and table header background'],
  ['--amb-button-bg', 'Button background'],
  ['--amb-button-hover', 'Button hover background'],
  ['--amb-accent', 'Pressed wrap button and focus ring'],
  ['--amb-accent-fg', 'Text on the accent color'],
  ['--amb-code-bg', 'Inline code and code block background'],
  ['--amb-link', 'Link color in the preview'],
  ['--amb-radius', 'Corner radius'],
  ['--amb-font-sans', 'Font for the toolbar and preview'],
  ['--amb-font-mono', 'Font for the raw source'],
] as const

export function homePath() {
  const base = import.meta.env.BASE_URL
  return base.endsWith('/') ? base : `${base}/`
}

export function canonicalFor(pathname: string, site: URL) {
  const url = new URL(pathname, site)
  if (!url.pathname.endsWith('/')) url.pathname += '/'
  return url.href
}

export const brandCss = `.brand {
  --amb-accent: #7c3aed;
  --amb-accent-fg: #ffffff;
  --amb-border: #ddd6fe;
  --amb-toolbar-bg: #f5f3ff;
  --amb-radius: 0.75rem;
}

.dark .brand {
  --amb-border: #4c1d95;
  --amb-toolbar-bg: #2e1065;
}`
