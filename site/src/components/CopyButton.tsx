import { useEffect, useRef, useState } from 'react'
import { copyText } from '../lib/copy'

export function CopyButton({
  text,
  className = 'copy-btn',
  label = 'Copy',
}: {
  text: string
  className?: string
  label?: string
}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => window.clearTimeout(timer.current)
  }, [])

  return (
    <button
      type="button"
      className={className}
      aria-live="polite"
      onClick={async () => {
        if (!(await copyText(text))) return
        setCopied(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setCopied(false), 1200)
      }}
    >
      {copied ? 'Copied' : label}
    </button>
  )
}
