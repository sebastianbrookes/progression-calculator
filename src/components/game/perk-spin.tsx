"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Clock, Dices, Pencil, RotateCcw } from "lucide-react"
import { Button, ButtonLink } from "@/components/ui/button"
import { drawPerk, hasDuration, type Perk } from "@/lib/perks"
import { gameFromParams, gameToParams, scoreGame } from "@/lib/scoring"
import { perksStore, settingsStore } from "@/lib/stores"
import { useStore } from "@/lib/storage"
import { cn } from "@/lib/utils"
import { PERK_TYPE_LABEL, PERK_TYPE_TEXT } from "@/components/perk-style"
import { StatSummary } from "./stat-summary"
import { PerkReel, buildStrip, type ReelSlot } from "./perk-reel"

type Phase = "ready" | "spinning" | "landed"

export function PerkSpin() {
    const router = useRouter()
    const game = gameFromParams(useSearchParams())
    const perks = useStore(perksStore)
    const settings = useStore(settingsStore)
    const result = scoreGame(game, settings)

    const [phase, setPhase] = React.useState<Phase>("ready")
    const [perk, setPerk] = React.useState<Perk | null>(null)
    const [spinId, setSpinId] = React.useState(0)
    const [strip, setStrip] = React.useState<ReelSlot[]>(() => {
        const pick = () => perks[Math.floor(Math.random() * perks.length)] ?? null
        return [pick(), null, pick()]
    })

    const spin = () => {
        const next = drawPerk(perks)
        setStrip(buildStrip(perk, next, perks))
        setPerk(next)
        setPhase("spinning")
        setSpinId((id) => id + 1)
    }

    const editHref = `/?${gameToParams(game)}`
    const resultsHref = `/results?${gameToParams(game, phase === "landed" ? perk?.id : undefined)}`

    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="font-display text-5xl font-extrabold uppercase sm:text-6xl">
                        {phase === "landed" ? "You got" : "Spin for a perk"}
                    </h1>
                    <StatSummary stats={game.stats} className="mt-3" />
                </div>
                <p className="flex items-baseline gap-2 sm:flex-col sm:items-end sm:gap-0">
                    <span className="font-display text-4xl font-bold text-primary tabular-nums">+{result.attr}</span>
                    <span className="text-sm text-muted-foreground">attribute points</span>
                </p>
            </div>

            <PerkReel
                strip={strip}
                spinId={spinId}
                landed={phase === "landed" ? perk : null}
                onLand={() => setPhase("landed")}
            />

            <div className="min-h-24 pt-5" aria-live="polite">
                {phase === "landed" && perk ? (
                    <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                        <p className="sr-only">
                            {perk.name}: {perk.effect}
                        </p>
                        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                            <span className={cn("font-semibold", PERK_TYPE_TEXT[perk.type])}>{PERK_TYPE_LABEL[perk.type]}</span>
                            {hasDuration(perk) && (
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                    <Clock className="size-3.5" />
                                    {perk.duration}
                                </span>
                            )}
                        </p>
                        {perk.desc && <p className="mt-1.5 text-muted-foreground">{perk.desc}</p>}
                    </div>
                ) : (
                    <p className="text-muted-foreground">
                        {phase === "spinning" ? "Spinning…" : "Some perks help, some hurt, and some spins land on nothing."}
                    </p>
                )}
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                {phase === "landed" ? (
                    <>
                        <Button size="lg" className="sm:flex-1" onClick={() => router.push(resultsHref)}>
                            See results
                            <ArrowRight className="size-5" />
                        </Button>
                        <Button size="lg" variant="outline" onClick={spin}>
                            <RotateCcw />
                            Spin again
                        </Button>
                    </>
                ) : (
                    <>
                        <Button size="lg" className="sm:flex-1" onClick={spin} disabled={phase === "spinning"} autoFocus>
                            <Dices className={cn("size-5", phase === "spinning" && "animate-spin")} />
                            {phase === "spinning" ? "Spinning…" : "Spin"}
                        </Button>
                        {phase === "ready" && (
                            <ButtonLink href={resultsHref} size="lg" variant="ghost">
                                Skip the spin
                            </ButtonLink>
                        )}
                    </>
                )}
            </div>

            <ButtonLink href={editHref} variant="ghost" size="sm" className="mt-6 -ml-3">
                <Pencil />
                Edit stats
            </ButtonLink>
        </div>
    )
}
