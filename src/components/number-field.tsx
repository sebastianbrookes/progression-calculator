"use client"

import * as React from "react"
import { toCount } from "@/lib/scoring"
import { cn } from "@/lib/utils"

interface NumberFieldProps extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
    value: number
    onValueChange: (value: number) => void
}

// A whole-number input that saves as you type but lets the field be empty
// while editing, instead of snapping to 0 the moment it's cleared.
export function NumberField({ value, onValueChange, className, ...props }: NumberFieldProps) {
    const [draft, setDraft] = React.useState<string | null>(null)

    return (
        <input
            {...props}
            inputMode="numeric"
            autoComplete="off"
            value={draft ?? String(value)}
            onFocus={(e) => {
                setDraft(String(value))
                e.target.select()
            }}
            onChange={(e) => {
                const next = e.target.value.replace(/\D/g, "").slice(0, 4)
                setDraft(next)
                onValueChange(toCount(next))
            }}
            onBlur={() => setDraft(null)}
            className={cn(
                "h-8 w-14 rounded-lg bg-surface px-2 text-right text-foreground tabular-nums ring-1 ring-white/10 outline-none hover:ring-white/15 focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50",
                className,
            )}
        />
    )
}
