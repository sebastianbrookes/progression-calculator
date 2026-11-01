"use client"

import * as React from "react"
import { ChevronDown, Plus, RotateCcw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Input } from "@/components/ui/input"
import { PERK_TYPE_BG, PERK_TYPE_LABEL, PERK_TYPE_TEXT } from "@/components/perk-style"
import { NO_EFFECT_CHANCE, NO_EFFECT_ID, hasDuration, type Perk, type PerkType } from "@/lib/perks"
import { perksStore } from "@/lib/stores"
import { useHydrated, useStore } from "@/lib/storage"
import { cn } from "@/lib/utils"

const TYPES: PerkType[] = ["buff", "nerf", "neutral"]
type Filter = PerkType | "all"
const FILTER_LABEL: Record<Filter, string> = { all: "All", buff: "Buffs", nerf: "Nerfs", neutral: "Neutral" }

export function PerkEditor() {
    const perks = useStore(perksStore)
    const hydrated = useHydrated()
    const [filter, setFilter] = React.useState<Filter>("all")
    const [openId, setOpenId] = React.useState<string | null>(null)

    const update = (id: string, patch: Partial<Perk>) =>
        perksStore.set(perksStore.get().map((p) => (p.id === id ? { ...p, ...patch } : p)))
    const remove = (id: string) => perksStore.set(perksStore.get().filter((p) => p.id !== id))
    const add = () => {
        const perk: Perk = {
            id: `custom_${Date.now().toString(36)}`,
            name: "",
            effect: "",
            desc: "",
            duration: "",
            type: filter === "all" ? "buff" : filter,
            icon: "✨",
        }
        perksStore.set([perk, ...perksStore.get()])
        setOpenId(perk.id)
    }

    const pool = perks.filter((p) => p.id !== NO_EFFECT_ID).length
    const each = pool > 0 ? ((1 - NO_EFFECT_CHANCE) / pool) * 100 : 0
    const shown = filter === "all" ? perks : perks.filter((p) => p.type === filter)

    return (
        <>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-xl">
                    <h1 className="font-display text-5xl font-extrabold uppercase sm:text-6xl">Perks</h1>
                    <p className="mt-2 text-muted-foreground">
                        {Math.round(NO_EFFECT_CHANCE * 100)}% of spins land on No Effect. The rest pick one of your {pool}{" "}
                        other perks at random, about {each.toFixed(1)}% each. Changes save automatically on this device.
                    </p>
                </div>
                <ConfirmDialog
                    trigger={
                        <Button variant="outline">
                            <RotateCcw />
                            Reset to defaults
                        </Button>
                    }
                    title="Reset all perks?"
                    description="Your edits and any perks you added are removed, and the default perks come back. Point rules aren't affected."
                    confirmLabel="Reset perks"
                    onConfirm={() => {
                        perksStore.reset()
                        setOpenId(null)
                    }}
                />
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div role="radiogroup" aria-label="Show" className="flex rounded-md border bg-surface p-0.5">
                    {(["all", ...TYPES] as Filter[]).map((f) => {
                        const count = f === "all" ? perks.length : perks.filter((p) => p.type === f).length
                        return (
                            <button
                                key={f}
                                type="button"
                                role="radio"
                                aria-checked={filter === f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "rounded px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                                    filter === f && "bg-surface-raised text-foreground",
                                )}
                            >
                                {FILTER_LABEL[f]}{" "}
                                <span className="text-muted-foreground tabular-nums">{hydrated ? count : ""}</span>
                            </button>
                        )
                    })}
                </div>
                <Button onClick={add} disabled={!hydrated}>
                    <Plus />
                    Add perk
                </Button>
            </div>

            <ul className={cn("divide-y divide-line/60 border-y border-line/60", !hydrated && "opacity-0")}>
                {shown.map((perk) => (
                    <PerkRow
                        key={perk.id}
                        perk={perk}
                        open={openId === perk.id}
                        onToggle={() => setOpenId(openId === perk.id ? null : perk.id)}
                        onChange={(patch) => update(perk.id, patch)}
                        onDelete={() => remove(perk.id)}
                    />
                ))}
                {shown.length === 0 && (
                    <li className="py-8 text-center text-muted-foreground">No {filter === "all" ? "" : `${filter} `}perks yet. Add one to put it on the wheel.</li>
                )}
            </ul>
        </>
    )
}

interface PerkRowProps {
    perk: Perk
    open: boolean
    onToggle: () => void
    onChange: (patch: Partial<Perk>) => void
    onDelete: () => void
}

function PerkRow({ perk, open, onToggle, onChange, onDelete }: PerkRowProps) {
    const id = `perk-${perk.id}`
    const isNoEffect = perk.id === NO_EFFECT_ID

    return (
        <li className={cn(open && "bg-surface")}>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls={id}
                className="relative flex w-full items-center gap-4 py-3 pr-2 pl-4 text-left hover:bg-surface"
            >
                <span className={cn("absolute top-3 bottom-3 left-0 w-1 rounded-r", PERK_TYPE_BG[perk.type])} aria-hidden />
                <span className="w-8 shrink-0 text-center text-2xl leading-none">{perk.icon || "✨"}</span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{perk.name || "Untitled perk"}</span>
                    <span className="block truncate text-sm text-muted-foreground">{perk.effect || "No effect written yet"}</span>
                </span>
                <span className="hidden shrink-0 text-sm text-muted-foreground sm:block">{hasDuration(perk) ? perk.duration : ""}</span>
                <span className={cn("w-16 shrink-0 text-right text-xs font-semibold", PERK_TYPE_TEXT[perk.type])}>{PERK_TYPE_LABEL[perk.type]}</span>
                <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
            </button>

            {open && (
                <div id={id} className="grid gap-4 px-4 pt-1 pb-5 sm:grid-cols-[4.5rem_1fr_1fr]">
                    <Field label="Icon" htmlFor={`${id}-icon`}>
                        <Input id={`${id}-icon`} value={perk.icon} onChange={(e) => onChange({ icon: e.target.value })} className="text-center text-xl" />
                    </Field>
                    <Field label="Name" htmlFor={`${id}-name`}>
                        <Input
                            id={`${id}-name`}
                            value={perk.name}
                            onChange={(e) => onChange({ name: e.target.value })}
                            placeholder="Mamba Mentality"
                            autoFocus={!perk.name}
                        />
                    </Field>
                    <Field label="Effect" htmlFor={`${id}-effect`}>
                        <Input id={`${id}-effect`} value={perk.effect} onChange={(e) => onChange({ effect: e.target.value })} placeholder="+5 Mid-Range Shot" />
                    </Field>
                    <Field label="Duration" htmlFor={`${id}-duration`} className="sm:col-start-2">
                        <Input id={`${id}-duration`} value={perk.duration} onChange={(e) => onChange({ duration: e.target.value })} placeholder="10 games" />
                    </Field>
                    <Field label="Note" htmlFor={`${id}-desc`}>
                        <Input id={`${id}-desc`} value={perk.desc} onChange={(e) => onChange({ desc: e.target.value })} placeholder="Only for players 21 or younger" />
                    </Field>

                    <div className="flex flex-wrap items-end justify-between gap-3 sm:col-span-2 sm:col-start-2">
                        {isNoEffect ? (
                            <p className="text-sm text-muted-foreground">No Effect is what a spin lands on when nothing happens, so it can&apos;t be deleted.</p>
                        ) : (
                            <>
                                <div role="radiogroup" aria-label="Type" className="flex gap-1.5">
                                    {TYPES.map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            role="radio"
                                            aria-checked={perk.type === t}
                                            onClick={() => onChange({ type: t })}
                                            className={cn(
                                                "rounded-md border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                                                perk.type === t && cn("border-current bg-current/10", PERK_TYPE_TEXT[t]),
                                            )}
                                        >
                                            {PERK_TYPE_LABEL[t]}
                                        </button>
                                    ))}
                                </div>
                                <ConfirmDialog
                                    trigger={
                                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                            <Trash2 />
                                            Delete
                                        </Button>
                                    }
                                    title={`Delete ${perk.name || "this perk"}?`}
                                    description="It comes off the wheel. Resetting perks to defaults brings back any default perk you delete."
                                    confirmLabel="Delete perk"
                                    onConfirm={onDelete}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </li>
    )
}

function Field({ label, htmlFor, className, children }: { label: string; htmlFor: string; className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("grid gap-1.5", className)}>
            <label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
                {label}
            </label>
            {children}
        </div>
    )
}
