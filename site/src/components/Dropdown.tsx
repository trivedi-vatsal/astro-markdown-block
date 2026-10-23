import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

export type DropdownOption = { value: string; label: string }

// Select-only combobox, following the WAI-ARIA APG pattern.
export function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: ReactNode
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
}) {
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const selected = options.findIndex((option) => option.value === value)

  useEffect(() => {
    if (!open) return
    function close(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  function show() {
    setActive(Math.max(selected, 0))
    setOpen(true)
  }

  function pick(index: number) {
    const option = options[index]
    if (option) onChange(option.value)
    setOpen(false)
    box.current?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const { key } = event
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
        event.preventDefault()
        show()
      }
      return
    }
    const last = options.length - 1
    const moves: Record<string, number> = {
      ArrowDown: Math.min(active + 1, last),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: last,
    }
    if (key in moves) {
      event.preventDefault()
      setActive(moves[key]!)
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault()
      pick(active)
    } else if (key === 'Escape') {
      event.preventDefault()
      setOpen(false)
    } else if (key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div className="field dd" ref={root}>
      <span id={`${id}-label`}>{label}</span>
      <div
        ref={box}
        role="combobox"
        tabIndex={0}
        className="dd-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label`}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
      >
        <span>{options[selected]?.label}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      <ul
        id={`${id}-list`}
        role="listbox"
        className="dd-list"
        aria-labelledby={`${id}-label`}
        hidden={!open}
      >
        {options.map((option, index) => (
          <li
            key={option.value}
            id={`${id}-${index}`}
            role="option"
            aria-selected={index === selected}
            data-active={index === active || undefined}
            onPointerMove={() => setActive(index)}
            onClick={() => pick(index)}
          >
            {option.label}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </li>
        ))}
      </ul>
    </div>
  )
}
