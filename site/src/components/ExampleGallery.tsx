import { useRef, useState, type KeyboardEvent } from 'react'
import { MarkdownBlock, type MarkdownBlockProps } from 'astro-markdown-block'
import { CopyButton } from './CopyButton'
import { moveTab } from '../lib/tabs'

export type GalleryExample = {
  id: string
  label: string
  description: string
  source: string
  code: string
  css?: string
  title?: string
  defaultMode?: MarkdownBlockProps['defaultMode']
  className?: string
  labels?: MarkdownBlockProps['labels']
}

export function ExampleGallery({ examples }: { examples: GalleryExample[] }) {
  const first = examples[0]
  const [active, setActive] = useState(first?.id ?? '')
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({})
  const current = examples.find((example) => example.id === active) ?? first
  if (!current) return null

  function select(id: string, focus: boolean) {
    setActive(id)
    if (focus) tabs.current[id]?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = examples.findIndex((example) => example.id === current.id)
    const next = moveTab(index, examples.length, event.key)
    if (next === null) return
    event.preventDefault()
    const example = examples[next]
    if (example) select(example.id, true)
  }

  return (
    <div className="gallery">
      <div
        className="segments"
        role="tablist"
        aria-label="Example categories"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
      >
        {examples.map((example) => {
          const selected = example.id === current.id
          return (
            <button
              key={example.id}
              ref={(node) => {
                tabs.current[example.id] = node
              }}
              type="button"
              role="tab"
              id={`example-tab-${example.id}`}
              aria-selected={selected}
              aria-controls="example-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => select(example.id, false)}
            >
              {example.label}
            </button>
          )
        })}
      </div>
      <div
        id="example-panel"
        role="tabpanel"
        aria-labelledby={`example-tab-${current.id}`}
      >
        <p className="gallery-desc">{current.description}</p>
        <div className="frame">
          <MarkdownBlock
            key={current.id}
            title={current.title ?? current.label}
            source={current.source}
            defaultMode={current.defaultMode}
            className={current.className}
            labels={current.labels}
            height="auto"
          />
        </div>
        {current.css && (
          <div className="stack">
            <p className="code-label">CSS</p>
            <div className="codeblock">
              <CopyButton text={current.css} />
              <pre>
                <code>{current.css}</code>
              </pre>
            </div>
          </div>
        )}
        <div className="stack">
          <p className="code-label">Usage</p>
          <div className="codeblock">
            <CopyButton text={current.code} />
            <pre>
              <code>{current.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
