"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Dices } from "lucide-react"
import { Button, ButtonLink } from "@/components/ui/button"
import { AWARDS, STATS, type Award, type PointSettings, type StatKey } from "@/lib/rules"
import { gameFromParams, gameToParams, scoreGame, toCount, type Game } from "@/lib/scoring"
import { settingsStore } from "@/lib/stores"
import { useStore } from "@/lib/storage"
import { cn } from "@/lib/utils"

type Draft = Record<StatKey, string>

const EMPTY_GAME: Game = { stats: { points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0 }, awards: [] }

// Prefills from the URL so "Edit stats" on later screens brings the numbers back.
export function GameFormFromUrl() {
    const params = useSearchParams()
    const initial = React.useMemo(() => gameFromParams(params), [params])
    return <GameForm initial={initial} />
}

export function GameForm({ initial = EMPTY_GAME }: { initial?: Game }) {
    const router = useRouter()
    const settings = useStore(settingsStore)
    const [draft, setDraft] = React.useState<Draft>(
        () => Object.fromEntries(STATS.map(({ key }) => [key, initial.stats[key] ? String(initial.stats[key]) : ""])) as Draft,
    )
    const [awards, setAwards] = React.useState<string[]>(initial.awards)

    const game: Game = {
        stats: Object.fromEntries(STATS.map(({ key }) => [key, toCount(draft[key])])) as Game["stats"],
        awards,
    }
    const result = scoreGame(game, settings)
    const query = gameToParams(game).toString()

    const toggleAward = (id: string) =>
        setAwards((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                router.push(`/spin?${query}`)
            }}
            className="space-y-10"
        >
            <fieldset>
                <legend className="mb-3 text-sm font-medium text-muted-foreground">Box score</legend>
                <div className="grid grid-cols-5 overflow-hidden rounded-lg border bg-surface">
                    {STATS.map(({ key, label, abbr }, i) => (
                        <label
                            key={key}
                            className={cn(
                                "group relative flex cursor-text flex-col items-center pt-3 pb-2 transition-colors focus-within:bg-surface-raised",
                                i > 0 && "border-l",
                            )}
                        >
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground group-focus-within:text-primary" aria-hidden>
                                {abbr}
                            </span>
                            <span className="sr-only">{label}</span>
                            <input
                                name={key}
                                inputMode="numeric"
                                autoComplete="off"
                                autoFocus={i === 0}
                                value={draft[key]}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "").slice(0, 3)
                                    setDraft((prev) => ({ ...prev, [key]: value }))
                                }}
                                onFocus={(e) => e.target.select()}
                                placeholder="0"
                                className="w-full bg-transparent text-center font-display text-5xl leading-none font-bold outline-none placeholder:text-muted-foreground/30 sm:text-7xl"
                            />
                            <span className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 bg-primary transition-transform group-focus-within:scale-x-100" />
                        </label>
                    ))}
                </div>
            </fieldset>

            <div className="grid gap-8 lg:grid-cols-2">
                <AwardGroup
                    legend="Game and monthly awards"
                    awards={AWARDS.filter((a) => a.kind === "recurring")}
                    selected={awards}
                    onToggle={toggleAward}
                    settings={settings}
                />
                <AwardGroup
                    legend="Season awards"
                    awards={AWARDS.filter((a) => a.kind === "season")}
                    selected={awards}
                    onToggle={toggleAward}
                    settings={settings}
                />
            </div>

            <div className="flex flex-col gap-5 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-baseline gap-6" aria-live="polite">
                    <Tally value={result.attr} label="attribute points" className="text-primary" />
                    <Tally value={result.badge} label="badge points" className="text-badge" />
                </div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                    <ButtonLink href={`/results?${query}`} variant="ghost" size="lg">
                        Skip the spin
                    </ButtonLink>
                    <Button type="submit" size="lg">
                        <Dices className="size-5" />
                        Spin for a perk
                    </Button>
                </div>
            </div>
        </form>
    )
}

function Tally({ value, label, className }: { value: number; label: string; className: string }) {
    return (
        <p className="flex items-baseline gap-2">
            <span className={cn("font-display text-4xl font-bold tabular-nums", value === 0 && "text-muted-foreground/50", value > 0 && className)}>
                +{value}
            </span>
            <span className="text-sm text-muted-foreground">{label}</span>
        </p>
    )
}

interface AwardGroupProps {
    legend: string
    awards: Award[]
    selected: string[]
    onToggle: (id: string) => void
    settings: PointSettings
}

function AwardGroup({ legend, awards, selected, onToggle, settings }: AwardGroupProps) {
    return (
        <fieldset>
            <legend className="mb-3 text-sm font-medium text-muted-foreground">{legend}</legend>
            <div className="grid grid-cols-2 gap-2">
                {awards.map((award) => {
                    const on = selected.includes(award.id)
                    return (
                        <button
                            key={award.id}
                            type="button"
                            aria-pressed={on}
                            onClick={() => onToggle(award.id)}
                            className={cn(
                                "flex items-center justify-between gap-2 rounded-md border px-3 py-2.5 text-left text-sm font-medium transition-colors",
                                on
                                    ? "border-primary bg-primary/10 text-foreground"
                                    : "bg-surface text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground",
                            )}
                        >
                            {award.kind === "season" ? (
                                <span title={award.label}>{award.short}</span>
                            ) : (
                                <span className="truncate" title={award.label}>
                                    <span className="sm:hidden">{award.short}</span>
                                    <span className="hidden sm:inline">{award.label}</span>
                                </span>
                            )}
                            <span className="flex shrink-0 gap-1.5 text-xs tabular-nums">
                                <span className={on ? "text-primary" : undefined}>+{settings[award.attr]}</span>
                                {award.badge && <span className={on ? "text-badge" : undefined}>+{settings[award.badge]}</span>}
                            </span>
                        </button>
                    )
                })}
            </div>
        </fieldset>
    )
}
