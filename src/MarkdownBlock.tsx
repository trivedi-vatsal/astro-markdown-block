import { useState } from 'react'
import ReactMarkdown, { type Components, type Options } from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import { CheckIcon, CodeIcon, CopyIcon, EyeIcon, WrapIcon } from './icons'

type PluggableList = NonNullable<Options['remarkPlugins']>

export type MarkdownBlockPart =
  | 'root'
  | 'toolbar'
  | 'title'
  | 'actions'
  | 'button'
  | 'body'
  | 'preview'
  | 'source'

export interface MarkdownBlockLabels {
  preview: string
  markdown: string
  copy: string
  copied: string
  wrap: string
}

export interface MarkdownBlockProps {
  source: string
  title?: string
  defaultMode?: 'preview' | 'markdown'
  height?: string | number
  remarkPlugins?: PluggableList
  rehypePlugins?: PluggableList
  components?: Components
  labels?: Partial<MarkdownBlockLabels>
  className?: string
  classNames?: Partial<Record<MarkdownBlockPart, string>>
}

const defaultLabels: MarkdownBlockLabels = {
  preview: 'Preview',
  markdown: 'Markdown',
  copy: 'Copy',
  copied: 'Copied',
  wrap: 'Word wrap',
}

const defaultRemarkPlugins: PluggableList = [remarkGfm]
const defaultRehypePlugins: PluggableList = [
  [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
]

function cx(...names: (string | false | undefined)[]) {
  return names.filter(Boolean).join(' ')
}

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.left = '-9999px'
    document.body.append(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

export function MarkdownBlock({
  source,
  title,
  defaultMode = 'preview',
  height = '24rem',
  remarkPlugins = defaultRemarkPlugins,
  rehypePlugins = defaultRehypePlugins,
  components,
  labels,
  className,
  classNames = {},
}: MarkdownBlockProps) {
  const [preview, setPreview] = useState(defaultMode === 'preview')
  const [wrap, setWrap] = useState(true)
  const [copied, setCopied] = useState(false)
  const text = { ...defaultLabels, ...labels }
  const button = cx('amb-button', classNames.button)

  async function copy() {
    if (!(await writeClipboard(source))) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className={cx('amb-root', className, classNames.root)}>
      <div className={cx('amb-toolbar', classNames.toolbar)}>
        <div className={cx('amb-title', classNames.title)}>
          {preview ? <EyeIcon /> : <CodeIcon />}
          {title && <span className="amb-title-text">{title}</span>}
          {title && <span aria-hidden="true">·</span>}
          <span className="amb-mode">
            {preview ? text.preview : text.markdown}
          </span>
        </div>
        <div className={cx('amb-actions', classNames.actions)}>
          <button
            type="button"
            className={button}
            onClick={() => setPreview(!preview)}
          >
            {preview ? <CodeIcon /> : <EyeIcon />}
            {preview ? text.markdown : text.preview}
          </button>
          {!preview && (
            <button
              type="button"
              className={cx(button, 'amb-button-icon')}
              aria-label={text.wrap}
              aria-pressed={wrap}
              title={text.wrap}
              onClick={() => setWrap(!wrap)}
            >
              <WrapIcon />
            </button>
          )}
          <button
            type="button"
            className={cx(button, 'amb-button-icon')}
            aria-label={copied ? text.copied : text.copy}
            title={copied ? text.copied : text.copy}
            data-copied={copied || undefined}
            onClick={copy}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>
      </div>
      <div className={cx('amb-body', classNames.body)} style={{ height }}>
        {preview ? (
          <div className={cx('amb-preview', classNames.preview)}>
            <ReactMarkdown
              remarkPlugins={remarkPlugins}
              rehypePlugins={rehypePlugins}
              components={components}
            >
              {source}
            </ReactMarkdown>
          </div>
        ) : (
          <pre
            className={cx('amb-source', classNames.source)}
            data-wrap={wrap || undefined}
          >
            {source}
          </pre>
        )}
      </div>
    </div>
  )
}
