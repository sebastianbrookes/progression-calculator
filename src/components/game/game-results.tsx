"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Check, Copy, Dices, Pencil, Plus } from "lucide-react"
import { Button, ButtonLink } from "@/components/ui/button"
import { PerkDuration, PerkTypeLabel } from "@/components/perk-style"
import { DEFAULT_PERKS, hasDuration, type Perk } from "@/lib/perks"
import { STATS, UPGRADE_COSTS } from "@/lib/rules"
import { gameFromParams, gameToParams, scoreGame, type Game, type GameResult } from "@/lib/scoring"
import { perksStore, preferencesStore, settingsStore } from "@/lib/stores"
import { useStore } from "@/lib/storage"
import { cn } from "@/lib/utils"
import { StatSummary } from "./stat-summary"

const COST_COLOUR: Record<(typeof UPGRADE_COSTS)[number]["colour"], string> = {
    white: "bg-slate-100",
    yellow: "bg-yellow-400",
    gray: "bg-slate-500",
    purple: "bg-purple-400",
    orange: "bg-orange-500",
}

export function GameResults() {
    const params = useSearchParams()
    const game = gameFromParams(params)
    const perks = useStore(perksStore)
    const settings = useStore(settingsStore)
    const { perksEnabled } = useStore(preferencesStore)
    const result = scoreGame(game, settings)

    const perkId = params.get("perk")
    const perk = perkId ? (perks.find((p) => p.id === perkId) ?? DEFAULT_PERKS.find((p) => p.id === perkId) ?? null) : null
    const showBadges = result.badge > 0

    return (
        <>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl text-foreground">Game result</h1>
                    <StatSummary stats={game.stats} className="mt-2" />
                </div>
                <div className="flex gap-2">
                    <CopySummaryButton game={game} result={result} perk={perk} />
                    <ButtonLink href="/">
                        <Plus />
                        Log next game
                    </ButtonLink>
                </div>
            </div>

            <section aria-label="Points earned">
                <div className="flex gap-12">
                    <Total value={result.attr} label="Attribute points" accent />
                    <Total value={result.badge} label="Badge points" />
                </div>

                {result.items.length === 0 ? (
                    <p className="mt-8 border-t pt-6 text-sm text-muted-foreground">
                        This game didn&apos;t reach any point thresholds. The lowest ones are 10 points, 10 rebounds or
                        assists, and 3 steals or blocks.
                    </p>
                ) : (
                    <table className="mt-8 w-full text-left text-sm">
                        <thead className={showBadges ? undefined : "sr-only"}>
                            <tr className="text-right text-xs text-muted-foreground">
                                <th className="pb-2 text-left font-normal">
                                    <span className="sr-only">Reason</span>
                                </th>
                                <th className="pb-2 font-normal">Attribute</th>
                                {showBadges && <th className="pb-2 font-normal">Badge</th>}
                            </tr>
                        </thead>
                        <tbody className="border-t">
                            {result.items.map((item) => (
                                <tr key={item.label} className="border-b">
                                    <td className="py-3 text-secondary-foreground">{item.label}</td>
                                    <td className="w-20 py-3 text-right text-primary tabular-nums">{item.attr > 0 && `+${item.attr}`}</td>
                                    {showBadges && (
                                        <td className="w-20 py-3 text-right text-foreground tabular-nums">{item.badge > 0 && `+${item.badge}`}</td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            <div className="mt-12 grid gap-8 sm:grid-cols-2">
                {(perk || perksEnabled) && <PerkPanel perk={perk} spinHref={`/spin?${gameToParams(game)}`} />}

                <section>
                    <h2 className="mb-3 text-sm text-muted-foreground">Cost of a +1 upgrade</h2>
                    <ul className="text-sm">
                        {UPGRADE_COSTS.map(({ range, cost, colour }) => (
                            <li key={range} className="flex items-center gap-3 border-b py-2 first:border-t">
                                <span className={cn("size-2 rounded-full", COST_COLOUR[colour])} aria-hidden />
                                <span className="flex-1 text-secondary-foreground">Rated {range.toLowerCase()}</span>
                                <span className="text-foreground tabular-nums">
                                    {cost} {cost === 1 ? "point" : "points"}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <ButtonLink href={`/?${gameToParams(game)}`} variant="ghost" size="sm" className="mt-10 -ml-2.5">
                <Pencil />
                Edit stats
            </ButtonLink>
        </>
    )
}

function Total({ value, label, accent = false }: { value: number; label: string; accent?: boolean }) {
    return (
        <p>
            <span className={cn("block text-5xl font-extralight tabular-nums", value === 0 ? "text-muted-foreground/50" : accent && "text-primary")}>
                +{value}
            </span>
            <span className="mt-1.5 block text-xs text-muted-foreground">{label}</span>
        </p>
    )
}

function PerkPanel({ perk, spinHref }: { perk: Perk | null; spinHref: string }) {
    if (!perk) {
        return (
            <section className="self-start rounded-2xl p-5 ring-1 ring-white/10 ring-inset">
                <h2 className="text-sm text-foreground">No perk this game</h2>
                <p className="mt-1 text-sm text-muted-foreground">The spin was skipped.</p>
                <ButtonLink href={spinHref} variant="outline" size="sm" className="mt-4">
                    <Dices />
                    Spin for a perk
                </ButtonLink>
            </section>
        )
    }
    return (
        <section className="panel self-start p-5">
            <h2 className="sr-only">Perk</h2>
            <div className="flex items-start gap-3">
                <span className="text-4xl leading-none">{perk.icon || "✨"}</span>
                <div className="min-w-0 flex-1">
                    <p className="text-base text-foreground">{perk.name}</p>
                    <PerkTypeLabel type={perk.type} className="text-xs" />
                </div>
                {hasDuration(perk) && <PerkDuration duration={perk.duration} />}
            </div>
            <p className="mt-4 text-sm text-secondary-foreground">{perk.effect}</p>
            {perk.desc && <p className="mt-1 text-sm text-muted-foreground">{perk.desc}</p>}
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
