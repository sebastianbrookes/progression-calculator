"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  className?: string
  children: React.ReactNode
}

// A modal built on the native <dialog>, which handles focus trapping,
// Escape, and returning focus to whatever opened it.
export function Dialog({ open, onClose, title, description, className, children }: DialogProps) {
  const ref = React.useRef<HTMLDialogElement>(null)
  const titleId = React.useId()

  // Layout effect, so the box never paints empty between closing and close().
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) {
      el.showModal()
      // React's autoFocus runs before the dialog is shown, so it can't work
      // here. Mark the field to focus with data-autofocus instead.
      el.querySelector<HTMLElement>("[data-autofocus]")?.focus()
    }
    if (!open && el.open) el.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className={cn(
        "m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-white/[0.08] bg-neutral-900 p-6 text-foreground shadow-2xl shadow-black/60 backdrop:bg-black/60 open:animate-in open:fade-in-0 open:zoom-in-[0.98] open:duration-150",
        className,
      )}
    >
      {open && (
        <>
          <h2 id={titleId} className="text-base text-foreground">
            {title}
          </h2>
          {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
          {children}
        </>
      )}
    </dialog>
  )
}
