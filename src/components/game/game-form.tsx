"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Dices } from "lucide-react"
import { Button, ButtonLink } from "@/components/ui/button"
import { AWARDS, STATS, type Award, type PointSettings, type StatKey } from "@/lib/rules"
import { gameFromParams, gameToParams, scoreGame, toCount, type Game } from "@/lib/scoring"
import { preferencesStore, settingsStore } from "@/lib/stores"
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
    const { perksEnabled } = useStore(preferencesStore)
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
                router.push(perksEnabled ? `/spin?${query}` : `/results?${query}`)
            }}
            className="space-y-10"
        >
            <fieldset>
                <legend className="mb-3 text-sm text-muted-foreground">Box score</legend>
                <div data-tour="box-score" className="panel grid grid-cols-5 overflow-hidden">
                    {STATS.map(({ key, label, abbr }, i) => (
                        <label
                            key={key}
                            className={cn(
                                "group relative flex cursor-text flex-col items-center gap-1 pt-4 pb-3 transition-colors focus-within:bg-white/[0.03]",
                                i > 0 && "border-l",
                            )}
                        >
                            <span
                                className={cn(
                                    "text-xs tracking-wide transition-colors group-focus-within:text-primary",
                                    draft[key] ? "text-secondary-foreground" : "text-muted-foreground",
                                )}
                                aria-hidden
                            >
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
                                className="w-full bg-transparent text-center text-4xl font-extralight tabular-nums outline-none placeholder:text-white/15 sm:text-5xl"
                            />
                            <span
                                aria-hidden
                                className="absolute inset-x-5 bottom-0 h-0.5 origin-center scale-x-0 rounded-full bg-primary transition-transform duration-200 ease-out group-focus-within:scale-x-100"
                            />
                        </label>
                    ))}
                </div>
            </fieldset>

            <div className="grid gap-10 lg:grid-cols-2 lg:gap-6">
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

            <div className="panel relative flex flex-col gap-6 overflow-hidden p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
                <span
                    aria-hidden
                    className={cn(
                        "pointer-events-none absolute -top-24 -left-16 size-72 rounded-full bg-primary/10 blur-3xl transition-opacity duration-500",
                        result.attr > 0 ? "opacity-100" : "opacity-0",
                    )}
                />
                <div className="relative flex items-end gap-10" aria-live="polite">
                    <Tally value={result.attr} label="Attribute points" accent />
                    <Tally value={result.badge} label="Badge points" />
                </div>
                <div className="relative flex flex-col-reverse gap-2 sm:flex-row">
                    {perksEnabled ? (
                        <>
                            <ButtonLink href={`/results?${query}`} variant="ghost">
                                Skip the spin
                            </ButtonLink>
                            <Button type="submit">
                                <Dices />
                                Spin for a perk
                            </Button>
                        </>
                    ) : (
                        <Button type="submit">
                            See results
                            <ArrowRight />
                        </Button>
                    )}
                </div>
            </div>
        </form>
    )
}

function Tally({ value, label, accent = false }: { value: number; label: string; accent?: boolean }) {
    return (
        <p>
            {/* Keyed so each change replays a small pop. */}
            <span
                key={value}
                className={cn(
                    "block text-5xl font-extralight tabular-nums animate-in fade-in-50 zoom-in-90 duration-200 motion-reduce:animate-none",
                    value === 0 ? "text-muted-foreground/50" : accent ? "text-primary" : "text-foreground",
                )}
            >
                +{value}
            </span>
            <span className="mt-1 block text-xs text-muted-foreground">{label}</span>
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
            <legend className="mb-3 text-sm text-muted-foreground">{legend}</legend>
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
                                "flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm ring-1 transition-[color,background-color,box-shadow] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                                on
                                    ? "bg-primary/10 text-foreground ring-primary/50 shadow-[0_0_24px_-10px_var(--primary)]"
                                    : "bg-surface text-secondary-foreground ring-white/[0.08] hover:bg-white/[0.06] hover:text-foreground",
                            )}
                        >
                            <span className="flex min-w-0 items-center gap-2.5">
                                <span
                                    aria-hidden
                                    className={cn(
                                        "size-1.5 shrink-0 rounded-full transition-[background-color,box-shadow] duration-150",
                                        on ? "bg-primary shadow-[0_0_8px_var(--primary)]" : "bg-white/15",
                                    )}
                                />
                                {award.kind === "season" ? (
                                    <span title={award.label}>{award.short}</span>
                                ) : (
                                    <span className="truncate" title={award.label}>
                                        <span className="sm:hidden">{award.short}</span>
                                        <span className="hidden sm:inline">{award.label}</span>
                                    </span>
                                )}
                            </span>
                            <span className="flex shrink-0 gap-1.5 text-xs text-muted-foreground tabular-nums">
                                <span className={on ? "text-primary" : undefined}>+{settings[award.attr]}</span>
                                {award.badge && <span className={on ? "text-foreground" : undefined}>+{settings[award.badge]}</span>}
                            </span>
                        </button>
                    )
                })}
            </div>
        </fieldset>
    )
}
