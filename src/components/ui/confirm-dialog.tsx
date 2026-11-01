"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  // The button that opens the dialog.
  trigger: React.ReactNode
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
}

// Built on the native <dialog>, which handles focus trapping, Escape, and
// returning focus to the trigger.
export function ConfirmDialog({ trigger, title, description, confirmLabel, onConfirm }: ConfirmDialogProps) {
  const ref = React.useRef<HTMLDialogElement>(null)
  const titleId = React.useId()
  const close = () => ref.current?.close()

  return (
    <>
      {/* Clicks on the trigger button bubble up to here. */}
      <span className="contents" onClick={() => ref.current?.showModal()}>
        {trigger}
      </span>
      <dialog
        ref={ref}
        role="alertdialog"
        aria-labelledby={titleId}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-lg border bg-surface p-5 text-foreground shadow-2xl shadow-black/40 backdrop:bg-background/70 backdrop:backdrop-blur-sm open:animate-in open:fade-in-0 open:zoom-in-95"
      >
        <h2 id={titleId} className="text-base font-semibold">
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={close} autoFocus>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              close()
              onConfirm()
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </dialog>
    </>
  )
}
