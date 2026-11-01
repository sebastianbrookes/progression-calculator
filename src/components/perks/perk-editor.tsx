"use client"

import * as React from "react"
import { Plus, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PERK_TYPE_LABEL, PerkDuration, PerkTypeDot } from "@/components/perk-style"
import { NO_EFFECT_CHANCE, NO_EFFECT_ID, hasDuration, type Perk, type PerkType } from "@/lib/perks"
import { perksStore } from "@/lib/stores"
import { useHydrated, useStore } from "@/lib/storage"
import { cn } from "@/lib/utils"

const TYPES: PerkType[] = ["buff", "nerf", "neutral"]
const GROUP_TITLE: Record<PerkType, string> = { buff: "Buffs", nerf: "Nerfs", neutral: "Neutral" }

// What the dialog is open for: a brand-new perk, or an existing one.
type Editing = { perk: Perk; isNew: boolean } | null

const blankPerk = (): Perk => ({
    id: `custom_${Date.now().toString(36)}`,
    name: "",
    effect: "",
    desc: "",
    duration: "",
    type: "buff",
    icon: "✨",
})

export function PerkEditor() {
    const perks = useStore(perksStore)
    const hydrated = useHydrated()
    const [editing, setEditing] = React.useState<Editing>(null)

    const save = (perk: Perk) => {
        const current = perksStore.get()
        perksStore.set(editing?.isNew ? [...current, perk] : current.map((p) => (p.id === perk.id ? perk : p)))
        setEditing(null)
    }
    const remove = (id: string) => {
        perksStore.set(perksStore.get().filter((p) => p.id !== id))
        setEditing(null)
    }

    const pool = perks.filter((p) => p.id !== NO_EFFECT_ID).length
    const each = pool > 0 ? ((1 - NO_EFFECT_CHANCE) / pool) * 100 : 0

    return (
        <>
            <div className="mb-10">
                <h1 className="text-xl text-foreground">Perks</h1>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    {Math.round(NO_EFFECT_CHANCE * 100)}% of spins land on No Effect. The rest pick one of your{" "}
                    {hydrated ? pool : "…"} other perks at random, about {hydrated ? each.toFixed(1) : "…"}% each.
                </p>
                <div className="mt-5 flex gap-2">
                    <Button onClick={() => setEditing({ perk: blankPerk(), isNew: true })} disabled={!hydrated}>
                        <Plus />
                        Add perk
                    </Button>
                    <ConfirmDialog
                        trigger={
                            <Button variant="ghost">
                                <RotateCcw />
                                Reset to defaults
                            </Button>
                        }
                        title="Reset all perks?"
                        description="Your edits and any perks you added are removed, and the default perks come back. Point rules aren't affected."
                        confirmLabel="Reset perks"
                        onConfirm={() => perksStore.reset()}
                    />
                </div>
            </div>

            <div className={cn("space-y-10", !hydrated && "invisible")}>
                {TYPES.map((type) => {
                    const group = perks.filter((p) => p.type === type)
                    return (
                        <section key={type} aria-labelledby={`group-${type}`}>
                            <h2 id={`group-${type}`} className="mb-2 flex items-center gap-2 text-sm text-foreground">
                                <PerkTypeDot type={type} />
                                {GROUP_TITLE[type]}
                                <span className="text-muted-foreground tabular-nums">{group.length}</span>
                            </h2>
                            {group.length === 0 ? (
                                <p className="border-y py-4 text-sm text-muted-foreground">
                                    No {GROUP_TITLE[type].toLowerCase()} yet.
                                </p>
                            ) : (
                                <ul className="divide-y border-y">
                                    {group.map((perk) => (
                                        <li key={perk.id}>
                                            <button
                                                type="button"
                                                onClick={() => setEditing({ perk, isNew: false })}
                                                className="-mx-3 flex w-[calc(100%+1.5rem)] items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors outline-none hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-primary/50"
                                            >
                                                <span className="w-7 shrink-0 text-center text-xl leading-none">{perk.icon || "✨"}</span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-sm text-foreground">{perk.name}</span>
                                                    <span className="block truncate text-xs text-muted-foreground">{perk.effect}</span>
                                                </span>
                                                {hasDuration(perk) && <PerkDuration duration={perk.duration} />}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    )
                })}
            </div>

            <Dialog open={editing !== null} onClose={() => setEditing(null)} title={editing?.isNew ? "Add perk" : "Edit perk"}>
                {editing && (
                    <PerkForm
                        key={editing.perk.id}
                        initial={editing.perk}
                        isNew={editing.isNew}
                        onSave={save}
                        onCancel={() => setEditing(null)}
                        onDelete={() => remove(editing.perk.id)}
                    />
                )}
            </Dialog>
        </>
    )
}

interface PerkFormProps {
    initial: Perk
    isNew: boolean
    onSave: (perk: Perk) => void
    onCancel: () => void
    onDelete: () => void
}

function PerkForm({ initial, isNew, onSave, onCancel, onDelete }: PerkFormProps) {
    const [perk, setPerk] = React.useState(initial)
    const set = (patch: Partial<Perk>) => setPerk((p) => ({ ...p, ...patch }))
    const isNoEffect = perk.id === NO_EFFECT_ID
    const canSave = perk.name.trim() !== ""

    return (
        <form
            className="mt-5 grid gap-4"
            onSubmit={(e) => {
                e.preventDefault()
                if (canSave) onSave({ ...perk, name: perk.name.trim() })
            }}
        >
            <div className="grid grid-cols-[4rem_1fr] gap-3">
                <Field label="Icon" htmlFor="perk-icon">
                    <Input id="perk-icon" value={perk.icon} onChange={(e) => set({ icon: e.target.value })} className="text-center text-lg" />
                </Field>
                <Field label="Name" htmlFor="perk-name">
                    <Input id="perk-name" value={perk.name} onChange={(e) => set({ name: e.target.value })} placeholder="Mamba Mentality" data-autofocus />
                </Field>
            </div>
            <Field label="Effect" htmlFor="perk-effect">
                <Input id="perk-effect" value={perk.effect} onChange={(e) => set({ effect: e.target.value })} placeholder="+5 Mid-Range Shot" />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Duration" htmlFor="perk-duration">
                    <Input id="perk-duration" value={perk.duration} onChange={(e) => set({ duration: e.target.value })} placeholder="10 games" />
                </Field>
                <Field label="Note (optional)" htmlFor="perk-desc">
                    <Input id="perk-desc" value={perk.desc} onChange={(e) => set({ desc: e.target.value })} placeholder="Players 21 or younger" />
                </Field>
            </div>

            {isNoEffect ? (
                <p className="text-xs text-muted-foreground">
                    No Effect is where a spin lands when nothing happens, so its type is fixed and it can&apos;t be deleted.
                </p>
            ) : (
                <fieldset>
                    <legend className="mb-1.5 text-xs text-muted-foreground">Type</legend>
                    <div role="radiogroup" className="flex gap-2">
                        {TYPES.map((t) => (
                            <button
                                key={t}
                                type="button"
                                role="radio"
                                aria-checked={perk.type === t}
                                onClick={() => set({ type: t })}
                                className={cn(
                                    "inline-flex h-8 items-center gap-2 rounded-lg px-3 text-sm ring-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                                    perk.type === t
                                        ? "bg-white/[0.08] text-foreground ring-white/20"
                                        : "text-muted-foreground ring-white/[0.08] hover:text-foreground",
                                )}
                            >
                                <PerkTypeDot type={t} />
                                {PERK_TYPE_LABEL[t]}
                            </button>
                        ))}
                    </div>
                </fieldset>
            )}

            <div className="mt-3 flex items-center gap-2">
                {!isNew && !isNoEffect && <DeleteButton onDelete={onDelete} />}
                <div className="ml-auto flex gap-2">
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!canSave}>
                        {isNew ? "Add perk" : "Save"}
                    </Button>
                </div>
            </div>
        </form>
    )
}

// Deletes on the second click, so a stray click can't remove a perk.
function DeleteButton({ onDelete }: { onDelete: () => void }) {
    const [armed, setArmed] = React.useState(false)

    React.useEffect(() => {
        if (!armed) return
        const timer = setTimeout(() => setArmed(false), 3000)
        return () => clearTimeout(timer)
    }, [armed])

    return (
        <Button
            type="button"
            variant={armed ? "destructive" : "ghost"}
            className={cn("-ml-2", !armed && "text-muted-foreground hover:text-destructive")}
            onClick={() => (armed ? onDelete() : setArmed(true))}
        >
            {armed ? "Click again to delete" : "Delete"}
        </Button>
    )
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
    return (
        <div className="grid gap-1.5">
            <label htmlFor={htmlFor} className="text-xs text-muted-foreground">
                {label}
            </label>
            {children}
        </div>
    )
}
