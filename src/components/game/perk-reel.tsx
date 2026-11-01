"use client"

import * as React from "react"
import type { Perk } from "@/lib/perks"
import { cn } from "@/lib/utils"
import { PerkDuration, PerkTypeDot } from "@/components/perk-style"
import { hasDuration } from "@/lib/perks"

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
        <div className="panel relative overflow-hidden px-2">
            <div className="h-72 overflow-hidden mask-[linear-gradient(transparent,black_30%,black_70%,transparent)]" aria-hidden>
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
            {/* The middle row is where the reel stops. */}
            <div
                className={cn(
                    "pointer-events-none absolute inset-x-2 top-24 h-24 rounded-xl ring-1 transition-[box-shadow,background-color] duration-300",
                    landed ? "bg-white/[0.03] ring-white/25" : "ring-white/10",
                )}
            />
        </div>
    )
}

function ReelRow({ slot }: { slot: ReelSlot }) {
    if (!slot) {
        return (
            <div className="flex h-24 items-center gap-4 px-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full text-lg text-muted-foreground ring-1 ring-white/15 ring-inset">?</span>
                <span className="text-lg text-muted-foreground">Perk waiting</span>
            </div>
        )
    }
    return (
        <div className="flex h-24 items-center gap-4 px-4">
            <span className="grid size-11 shrink-0 place-items-center text-4xl leading-none">{slot.icon || "✨"}</span>
            <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                    <PerkTypeDot type={slot.type} />
                    <span className="truncate text-lg text-foreground">{slot.name || "Untitled perk"}</span>
                </span>
                <span className="block truncate text-sm text-muted-foreground">{slot.effect}</span>
            </span>
            {hasDuration(slot) && <PerkDuration duration={slot.duration} />}
        </div>
    )
}
