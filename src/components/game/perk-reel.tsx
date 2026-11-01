"use client"

import * as React from "react"
import type { Perk } from "@/lib/perks"
import { cn } from "@/lib/utils"
import { PERK_TYPE_BG, PERK_TYPE_GLOW, PERK_TYPE_TEXT } from "@/components/perk-style"

const SPIN_MS = 4200
const FILLER_COUNT = 32

// A reel slot is a perk, or null for the face-down card shown before a spin.
export type ReelSlot = Perk | null

// The strip scrolls upward; the middle of the three visible rows is the
// payline. `from` is what's on the payline now, `to` is where it will stop.
export function buildStrip(from: ReelSlot, to: Perk, perks: Perk[], random = Math.random): ReelSlot[] {
    const pick = () => (perks.length > 0 ? perks[Math.floor(random() * perks.length)] : to)
    return [pick(), from, ...Array.from({ length: FILLER_COUNT }, pick), to, pick()]
}

interface PerkReelProps {
    strip: ReelSlot[]
    // Changes on every spin, restarting the animation.
    spinId: number
    landed: Perk | null
    onLand: () => void
}

export function PerkReel({ strip, spinId, landed, onLand }: PerkReelProps) {
    const stripRef = React.useRef<HTMLDivElement>(null)
    const onLandRef = React.useRef(onLand)
    React.useEffect(() => {
        onLandRef.current = onLand
    })

    React.useLayoutEffect(() => {
        const el = stripRef.current
        if (!el || spinId === 0) return
        const n = strip.length
        // Snap back to the start without animating, then roll to the end.
        el.style.transition = "none"
        el.style.transform = "translateY(0)"
        void el.offsetHeight
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        el.style.transition = reduceMotion ? "none" : `transform ${SPIN_MS}ms var(--ease-reel)`
        el.style.transform = `translateY(${(-100 * (n - 3)) / n}%)`
        if (reduceMotion) onLandRef.current()
    }, [spinId, strip.length])

    return (
        <div className="relative">
            <div
                className="h-84 overflow-hidden mask-[linear-gradient(transparent,black_28%,black_72%,transparent)]"
                aria-hidden
            >
                <div
                    ref={stripRef}
                    className="will-change-transform"
                    onTransitionEnd={(e) => {
                        if (e.target === e.currentTarget) onLandRef.current()
                    }}
                >
                    {strip.map((slot, i) => (
                        <ReelRow key={i} slot={slot} />
                    ))}
                </div>
            </div>
            {/* Payline */}
            <div
                className={cn(
                    "pointer-events-none absolute inset-x-0 top-28 h-28 rounded-lg border-2 transition-[border-color,background-color] duration-300",
                    landed
                        ? cn("bg-linear-to-t to-transparent", PERK_TYPE_GLOW[landed.type])
                        : "border-primary/70",
                )}
            />
        </div>
    )
}

function ReelRow({ slot }: { slot: ReelSlot }) {
    if (!slot) {
        return (
            <div className="flex h-28 items-center gap-5 px-5">
                <span className="grid size-14 shrink-0 place-items-center rounded-md border-2 border-dashed border-primary/60 font-display text-4xl font-bold text-primary">
                    ?
                </span>
                <span className="font-display text-3xl font-bold uppercase sm:text-4xl">Perk waiting</span>
            </div>
        )
    }
    return (
        <div className="relative flex h-28 items-center gap-5 px-5">
            <span className={cn("absolute top-5 bottom-5 left-0 w-1 rounded-r", PERK_TYPE_BG[slot.type])} />
            <span className="grid size-14 shrink-0 place-items-center text-5xl leading-none">{slot.icon || "✨"}</span>
            <span className="min-w-0">
                <span className={cn("block truncate font-display text-3xl leading-tight font-bold uppercase sm:text-4xl", PERK_TYPE_TEXT[slot.type])}>
                    {slot.name || "Untitled perk"}
                </span>
                <span className="block truncate text-sm text-muted-foreground sm:text-base">{slot.effect}</span>
            </span>
        </div>
    )
}
