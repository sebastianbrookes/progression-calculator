"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Check, Clock, Copy, Dices, Pencil, Plus } from "lucide-react"
import { Button, ButtonLink } from "@/components/ui/button"
import { DEFAULT_PERKS, hasDuration, type Perk } from "@/lib/perks"
import { STATS, UPGRADE_COSTS } from "@/lib/rules"
import { gameFromParams, gameToParams, scoreGame, type Game, type GameResult } from "@/lib/scoring"
import { perksStore, settingsStore } from "@/lib/stores"
import { useStore } from "@/lib/storage"
import { cn } from "@/lib/utils"
import { PERK_TYPE_GLOW, PERK_TYPE_LABEL, PERK_TYPE_TEXT } from "@/components/perk-style"
import { StatSummary } from "./stat-summary"

const COST_COLOUR: Record<(typeof UPGRADE_COSTS)[number]["colour"], string> = {
    white: "bg-foreground",
    yellow: "bg-yellow-400",
    gray: "bg-slate-400",
    purple: "bg-purple-400",
    orange: "bg-orange-500",
}

export function GameResults() {
    const params = useSearchParams()
    const game = gameFromParams(params)
    const perks = useStore(perksStore)
    const settings = useStore(settingsStore)
    const result = scoreGame(game, settings)

    const perkId = params.get("perk")
    const perk = perkId ? (perks.find((p) => p.id === perkId) ?? DEFAULT_PERKS.find((p) => p.id === perkId) ?? null) : null
    const showBadges = result.badge > 0

    return (
        <>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="font-display text-5xl font-extrabold uppercase sm:text-6xl">Game result</h1>
                    <StatSummary stats={game.stats} className="mt-3" />
                </div>
                <div className="flex gap-2">
                    <CopySummaryButton game={game} result={result} perk={perk} />
                    <ButtonLink href="/">
                        <Plus />
                        Log next game
                    </ButtonLink>
                </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
                <section aria-label="Points earned">
                    <div className="flex flex-wrap gap-x-12 gap-y-4 border-b pb-6">
                        <Total value={result.attr} label="attribute points" className="text-primary" />
                        <Total value={result.badge} label="badge points" className="text-badge" />
                    </div>

                    {result.items.length === 0 ? (
                        <p className="py-6 text-muted-foreground">
                            This game didn&apos;t reach any point thresholds. The lowest ones are 10 points, 10 rebounds or
                            assists, and 3 steals or blocks.
                        </p>
                    ) : (
                        <table className="w-full text-left">
                            <thead className={showBadges ? undefined : "sr-only"}>
                                <tr className="text-right text-xs font-medium text-muted-foreground">
                                    <th className="pt-3 text-left font-medium">
                                        <span className="sr-only">Reason</span>
                                    </th>
                                    <th className="pt-3 font-medium">Attribute</th>
                                    {showBadges && <th className="pt-3 font-medium">Badge</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {result.items.map((item) => (
                                    <tr key={item.label} className="border-b border-line/60">
                                        <td className="py-3 text-base sm:text-lg">{item.label}</td>
                                        <td className="w-16 py-3 text-right font-display text-2xl font-bold text-primary tabular-nums">
                                            {item.attr > 0 && `+${item.attr}`}
                                        </td>
                                        {showBadges && (
                                            <td className="w-20 py-3 text-right font-display text-2xl font-bold text-badge tabular-nums">
                                                {item.badge > 0 && `+${item.badge}`}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>

                <aside className="space-y-8">
                    <PerkPanel perk={perk} spinHref={`/spin?${gameToParams(game)}`} />

                    <section>
                        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Cost of a +1 upgrade</h2>
                        <ul className="space-y-px overflow-hidden rounded-lg border">
                            {UPGRADE_COSTS.map(({ range, cost, colour }) => (
                                <li key={range} className="flex items-center gap-3 bg-surface px-3 py-2 text-sm">
                                    <span className={cn("size-2.5 rounded-full", COST_COLOUR[colour])} aria-hidden />
                                    <span className="flex-1">Rated {range.toLowerCase()}</span>
                                    <span className="font-semibold tabular-nums">
                                        {cost} {cost === 1 ? "point" : "points"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </aside>
            </div>

            <ButtonLink href={`/?${gameToParams(game)}`} variant="ghost" size="sm" className="mt-10 -ml-3">
                <Pencil />
                Edit stats
            </ButtonLink>
        </>
    )
}

function Total({ value, label, className }: { value: number; label: string; className: string }) {
    return (
        <p>
            <span className={cn("block font-display text-8xl leading-none font-extrabold tabular-nums", value === 0 ? "text-muted-foreground/40" : className)}>
                +{value}
            </span>
            <span className="mt-1 block text-muted-foreground">{label}</span>
        </p>
    )
}

function PerkPanel({ perk, spinHref }: { perk: Perk | null; spinHref: string }) {
    if (!perk) {
        return (
            <section className="rounded-lg border border-dashed p-5">
                <h2 className="font-semibold">No perk this game</h2>
                <p className="mt-1 text-sm text-muted-foreground">The spin was skipped.</p>
                <ButtonLink href={spinHref} variant="outline" size="sm" className="mt-4">
                    <Dices />
                    Spin for a perk
                </ButtonLink>
            </section>
        )
    }
    return (
        <section className={cn("rounded-lg border-2 bg-linear-to-t to-transparent p-5", PERK_TYPE_GLOW[perk.type])}>
            <h2 className="sr-only">Perk</h2>
            <div className="flex items-center gap-4">
                <span className="text-5xl leading-none">{perk.icon || "✨"}</span>
                <div className="min-w-0">
                    <p className={cn("text-xs font-semibold", PERK_TYPE_TEXT[perk.type])}>{PERK_TYPE_LABEL[perk.type]}</p>
                    <p className="font-display text-3xl leading-tight font-bold uppercase">{perk.name}</p>
                </div>
            </div>
            <p className="mt-4 text-lg">{perk.effect}</p>
            {perk.desc && <p className="mt-1 text-sm text-muted-foreground">{perk.desc}</p>}
            {hasDuration(perk) && (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="size-3.5" />
                    {perk.duration}
                </p>
            )}
        </section>
    )
}

function CopySummaryButton({ game, result, perk }: { game: Game; result: GameResult; perk: Perk | null }) {
    const [copied, setCopied] = React.useState(false)

    const copy = async () => {
        const lines = [
            STATS.map(({ key, abbr }) => `${game.stats[key]} ${abbr}`).join(", "),
            `+${result.attr} attribute points, +${result.badge} badge points`,
            ...result.items.map((i) => `  ${i.label}: ${[i.attr && `+${i.attr}`, i.badge && `+${i.badge} badge`].filter(Boolean).join(", ")}`),
        ]
        if (perk) {
            lines.push(`Perk: ${perk.icon} ${perk.name}, ${perk.effect}${hasDuration(perk) ? ` (${perk.duration})` : ""}`)
        }
        try {
            await navigator.clipboard.writeText(lines.join("\n"))
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Clipboard access can be blocked; the button just doesn't confirm.
        }
    }

    return (
        <Button variant="outline" onClick={copy}>
            {copied ? <Check className="text-buff" /> : <Copy />}
            {copied ? "Copied" : "Copy summary"}
        </Button>
    )
}
