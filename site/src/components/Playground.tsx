import { useState } from 'react'
import { MarkdownBlock } from 'astro-markdown-block'
import { CopyButton } from './CopyButton'
import { Dropdown } from './Dropdown'

export type PlaygroundSample = {
  id: string
  label: string
  source: string
}

type Mode = 'preview' | 'markdown'

const modes = [
  { value: 'preview', label: 'preview' },
  { value: 'markdown', label: 'markdown' },
]

const themes = [
  { value: 'default', label: 'Default' },
  { value: 'brand', label: 'Violet' },
]

function usage(title: string, mode: Mode, themed: boolean) {
  const props = ['  client:visible']
  if (title) {
    props.push(
      title.includes('"')
        ? `  title={${JSON.stringify(title)}}`
        : `  title="${title}"`,
    )
  }
  props.push('  source={source}')
  if (mode === 'markdown') props.push('  defaultMode="markdown"')
  if (themed) props.push('  className="brand"')
  return `---
import { MarkdownBlock } from 'astro-markdown-block'
import 'astro-markdown-block/styles.css'
import source from './notes.md?raw'
---

<MarkdownBlock
${props.join('\n')}
/>`
}

export function Playground({
  samples,
  themeCss,
}: {
  samples: PlaygroundSample[]
  themeCss: string
}) {
  const first = samples[0]
  const [sampleId, setSampleId] = useState(first?.id ?? '')
  const [source, setSource] = useState(first?.source ?? '')
  const [title, setTitle] = useState(first?.label ?? '')
  const [mode, setMode] = useState<Mode>('preview')
  const [themed, setThemed] = useState(false)
  const sample = samples.find((item) => item.id === sampleId) ?? first
  if (!sample) return null

  const code = usage(title, mode, themed)

  function load(id: string) {
    const next = samples.find((item) => item.id === id)
    if (!next) return
    setSampleId(next.id)
    setSource(next.source)
    setTitle(next.label)
  }

  return (
    <div className="pg">
      <div className="pg-controls">
        <Dropdown
          label="Example"
          value={sample.id}
          options={samples.map((item) => ({
            value: item.id,
            label: item.label,
          }))}
          onChange={load}
        />
        <label className="field">
          <span>
            <code>title</code>
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <Dropdown
          label={<code>defaultMode</code>}
          value={mode}
          options={modes}
          onChange={(value) => setMode(value as Mode)}
        />
        <Dropdown
          label="Theme"
          value={themed ? 'brand' : 'default'}
          options={themes}
          onChange={(value) => setThemed(value === 'brand')}
        />
      </div>

      <div className="pg-split">
        <div className="pg-pane">
          <div className="pg-head">
            <label htmlFor="pg-source">Markdown</label>
            <button
              type="button"
              className="copy-btn"
              disabled={source === sample.source}
              onClick={() => setSource(sample.source)}
            >
              Reset
            </button>
          </div>
          <textarea
            id="pg-source"
            value={source}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            onChange={(e) => setSource(e.target.value)}
          />
        </div>
        <div className="pg-pane frame">
          <div className="pg-head">
            <span>Result</span>
          </div>
          <MarkdownBlock
            key={mode}
            title={title || undefined}
            source={source}
            defaultMode={mode}
            className={themed ? 'brand' : undefined}
            height="26rem"
          />
        </div>
      </div>

      <div className="stack">
        <p className="code-label">Code</p>
        <div className="codeblock">
          <CopyButton text={code} />
          <pre>
            <code>{code}</code>
          </pre>
        </div>
      </div>
      {themed && (
        <div className="stack">
          <p className="code-label">CSS</p>
          <div className="codeblock">
            <CopyButton text={themeCss} />
            <pre>
              <code>{themeCss}</code>
            </pre>
          </div>
        </div>
      )}
      <p className="note">
        Save your Markdown as <code>notes.md</code> next to the page. In a React
        app, drop <code>client:visible</code> and pass the string as{' '}
        <code>source</code>.
      </p>
    </div>
  )
}
