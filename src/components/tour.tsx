"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { tourStore } from "@/lib/stores"
import { useHydrated, useStore } from "@/lib/storage"
import { cn } from "@/lib/utils"

// Each step points at an element marked with a matching data-tour attribute.
const STEPS = [
    {
        target: "box-score",
        title: "Log a game",
        body: "Type in your player's box score and tap any awards they won. Attribute and badge points add up as you go.",
    },
    {
        target: "perks",
        title: "Spin for a perk",
        body: "After each game you spin for a random perk, then get a summary you can copy. Switch perks off here if your series doesn't use them.",
    },
    {
        target: "nav-rules",
        title: "Point rules",
        body: "Change how many points each stat and award is worth.",
    },
    {
        target: "nav-perks",
        title: "Perks",
        body: "Add, edit, or remove the perks you can spin, and set how long each one lasts. Everything saves automatically.",
    },
]

// Space around the highlighted element, between it and the card, and from the viewport edge.
const PAD = 4
const GAP = 10
const MARGIN = 16

// A short first-visit walkthrough of the game page. It doesn't block the
// page: there's no backdrop, and Skip, Escape, or leaving the page ends it.
export function Tour() {
    const pathname = usePathname()
    const seen = useStore(tourStore)
    const hydrated = useHydrated()
    const [settled, setSettled] = React.useState(false)
    const shown = React.useRef(false)

    const open = hydrated && settled && !seen && pathname === "/"

    // Let the page settle before the first step appears.
    React.useEffect(() => {
        const id = setTimeout(() => setSettled(true), 600)
        return () => clearTimeout(id)
    }, [])

    React.useEffect(() => {
        if (open) shown.current = true
    }, [open])

    // Following a link mid-tour (or logging a game) counts as being done with it.
    React.useEffect(() => {
        if (pathname !== "/" && shown.current) {
            shown.current = false
            tourStore.set(true)
        }
    }, [pathname])

    return open ? <TourCard onDone={finishTour} /> : null
}

const finishTour = () => tourStore.set(true)

// Replays the tour, for the footer.
export function TourButton({ className }: { className?: string }) {
    return (
        <button
            type="button"
            onClick={() => {
                window.scrollTo({ top: 0 })
                tourStore.set(false)
            }}
            className={className}
        >
            Take the tour
        </button>
    )
}

function TourCard({ onDone }: { onDone: () => void }) {
    const [index, setIndex] = React.useState(0)
    const cardRef = React.useRef<HTMLDivElement>(null)
    const ringRef = React.useRef<HTMLDivElement>(null)
    const titleId = React.useId()
    const step = STEPS[index]
    const last = index === STEPS.length - 1

    React.useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onDone()
        }
        document.addEventListener("keydown", onKeyDown)
        return () => document.removeEventListener("keydown", onKeyDown)
    }, [onDone])

    // Positioned by hand rather than through state so it can follow scrolling
    // and layout changes without re-rendering.
    React.useLayoutEffect(() => {
        const card = cardRef.current
        const ring = ringRef.current
        if (!card || !ring) return

        const target = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`)
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        target?.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" })

        const place = () => {
            const width = card.offsetWidth
            const height = card.offsetHeight
            if (!target) {
                ring.hidden = true
                card.style.top = `${window.innerHeight - height - MARGIN}px`
                card.style.left = `${(window.innerWidth - width) / 2}px`
                return
            }

            const r = target.getBoundingClientRect()
            const radius = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0
            ring.hidden = false
            Object.assign(ring.style, {
                top: `${r.top - PAD}px`,
                left: `${r.left - PAD}px`,
                width: `${r.width + PAD * 2}px`,
                height: `${r.height + PAD * 2}px`,
                borderRadius: `${radius + PAD}px`,
            })

            // Below the element if it fits, otherwise above.
            const below = r.bottom + PAD + GAP
            const above = r.top - PAD - GAP - height
            const fitsBelow = below + height <= window.innerHeight - MARGIN
            card.style.top = `${fitsBelow || above < MARGIN ? below : above}px`
            // Lined up with whichever edge of the element is nearer the middle of the screen.
            const left = r.left + r.width / 2 > window.innerWidth / 2 ? r.right - width : r.left
            card.style.left = `${Math.min(Math.max(left, MARGIN), window.innerWidth - width - MARGIN)}px`
        }

        place()
        const observer = new ResizeObserver(place)
        observer.observe(document.body)
        observer.observe(card)
        window.addEventListener("resize", place)
        window.addEventListener("scroll", place, { capture: true, passive: true })
        return () => {
            observer.disconnect()
            window.removeEventListener("resize", place)
            window.removeEventListener("scroll", place, { capture: true })
        }
    }, [step.target])

    return (
        <>
            <div
                key={index}
                ref={ringRef}
                aria-hidden
                className="pointer-events-none fixed z-40 ring-2 ring-primary/50 animate-in fade-in-0 duration-300 motion-reduce:animate-none"
            />
            <div
                ref={cardRef}
                role="dialog"
                aria-modal="false"
                aria-labelledby={titleId}
                className="panel fixed top-0 left-0 z-50 bg-neutral-900 w-[min(20rem,calc(100vw-2rem))] p-4 shadow-2xl shadow-black/60 animate-in fade-in-0 slide-in-from-bottom-1 duration-200 motion-reduce:animate-none"
            >
                <div key={index} aria-live="polite" className="animate-in fade-in-0 duration-200 motion-reduce:animate-none">
                    <h2 id={titleId} className="text-sm text-foreground">
                        {step.title}
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex gap-1.5">
                        <span className="sr-only">
                            Step {index + 1} of {STEPS.length}
                        </span>
                        {STEPS.map((s, i) => (
                            <span
                                key={s.target}
                                aria-hidden
                                className={cn("size-1.5 rounded-full transition-colors", i === index ? "bg-primary" : "bg-white/15")}
                            />
                        ))}
                    </div>
                    <div className="flex gap-1">
                        {!last && (
                            <Button variant="ghost" size="sm" onClick={onDone}>
                                Skip
                            </Button>
                        )}
                        <Button size="sm" onClick={() => (last ? onDone() : setIndex(index + 1))}>
                            {last ? "Done" : "Next"}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
