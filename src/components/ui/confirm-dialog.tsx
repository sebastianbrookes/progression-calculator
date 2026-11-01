"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"

interface ConfirmDialogProps {
  // The button that opens the dialog.
  trigger: React.ReactNode
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
}

export function ConfirmDialog({ trigger, title, description, confirmLabel, onConfirm }: ConfirmDialogProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      {/* Clicks on the trigger button bubble up to here. */}
      <span className="contents" onClick={() => setOpen(true)}>
        {trigger}
      </span>
      <Dialog open={open} onClose={() => setOpen(false)} title={title} description={description} className="max-w-sm">
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)} data-autofocus>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setOpen(false)
              onConfirm()
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </Dialog>
    </>
  )
}
