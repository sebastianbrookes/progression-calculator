"use client"

import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { NumberField } from "@/components/number-field"
import { AWARDS, DEFAULT_SETTINGS, MULTI_DOUBLES, STAT_TIERS, STATS, type SettingKey } from "@/lib/rules"
import { settingsStore } from "@/lib/stores"
import { useHydrated, useStore } from "@/lib/storage"

interface Row {
    label: string
    setting: SettingKey
}

const STAT_GROUPS = STATS.map(({ key, label }) => ({
    title: label,
    rows: STAT_TIERS[key].map(({ min, setting }) => ({ label: `${min}+ ${label.toLowerCase()}`, setting })),
}))

const MULTI_DOUBLE_ROWS: Row[] = [...MULTI_DOUBLES].reverse().map(({ label, setting }) => ({ label, setting }))
const RECURRING_AWARD_ROWS: Row[] = AWARDS.filter((a) => a.kind === "recurring").map((a) => ({ label: a.label, setting: a.attr }))
const SEASON_AWARDS = AWARDS.filter((a) => a.kind === "season")

export function PointRulesEditor() {
    const settings = useStore(settingsStore)
    const hydrated = useHydrated()
    const changed = (Object.keys(DEFAULT_SETTINGS) as SettingKey[]).filter((k) => settings[k] !== DEFAULT_SETTINGS[k]).length

    const update = (key: SettingKey, value: number) => settingsStore.set({ ...settingsStore.get(), [key]: value })

    const field = (setting: SettingKey, label: string) => (
        <div className="flex items-center justify-end gap-2">
            {settings[setting] !== DEFAULT_SETTINGS[setting] && (
                <button
                    type="button"
                    onClick={() => update(setting, DEFAULT_SETTINGS[setting])}
                    className="text-xs text-muted-foreground underline-offset-[3px] hover:text-foreground hover:underline"
                    aria-label={`Reset ${label} to the default, ${DEFAULT_SETTINGS[setting]}`}
                >
                    Default {DEFAULT_SETTINGS[setting]}
                </button>
            )}
            <NumberField
                aria-label={label}
                value={settings[setting]}
                onValueChange={(v) => update(setting, v)}
                disabled={!hydrated}
            />
        </div>
    )

    const group = (title: string, rows: Row[]) => (
        <section key={title}>
            <h2 className="mb-2 text-sm text-foreground">{title}</h2>
            <ul className="divide-y border-y text-sm">
                {rows.map(({ label, setting }) => (
                    <li key={setting} className="flex items-center justify-between gap-4 py-1.5">
                        <span className="text-secondary-foreground">{label}</span>
                        {field(setting, label)}
                    </li>
                ))}
            </ul>
        </section>
    )

    return (
        <>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-md">
                    <h1 className="text-xl text-foreground">Point rules</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        How many attribute points each milestone is worth. Only the highest tier reached in a stat counts.
                        Changes save automatically on this device.
                    </p>
                </div>
                <ConfirmDialog
                    trigger={
                        <Button variant="outline" size="sm" disabled={changed === 0}>
                            <RotateCcw />
                            Reset to defaults
                        </Button>
                    }
                    title="Reset all point rules?"
                    description={`${changed} ${changed === 1 ? "rule goes" : "rules go"} back to the default value. Perks aren't affected.`}
                    confirmLabel="Reset rules"
                    onConfirm={() => settingsStore.reset()}
                />
            </div>

            <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
                {group(STAT_GROUPS[0].title, STAT_GROUPS[0].rows)}
                <div className="space-y-10">
                    {group(STAT_GROUPS[1].title, STAT_GROUPS[1].rows)}
                    {group(STAT_GROUPS[2].title, STAT_GROUPS[2].rows)}
                </div>
                {group(STAT_GROUPS[3].title, STAT_GROUPS[3].rows)}
                {group(STAT_GROUPS[4].title, STAT_GROUPS[4].rows)}
                {group("Multi-doubles", MULTI_DOUBLE_ROWS)}
                {group("Game and monthly awards", RECURRING_AWARD_ROWS)}

                <section className="sm:col-span-2">
                    <h2 className="text-sm text-foreground">Season awards</h2>
                    <p className="mb-2 text-xs text-muted-foreground">Season awards also give badge points.</p>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-right text-xs text-muted-foreground">
                                <th className="pb-2 text-left font-normal">Award</th>
                                <th className="pb-2 font-normal">Attribute</th>
                                <th className="pb-2 pl-6 font-normal">Badge</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y border-y">
                            {SEASON_AWARDS.map((award) => (
                                <tr key={award.id}>
                                    <td className="py-1.5 text-secondary-foreground">{award.label}</td>
                                    <td className="py-1.5">{field(award.attr, `${award.label} attribute points`)}</td>
                                    <td className="py-1.5 pl-6">{award.badge && field(award.badge, `${award.label} badge points`)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </>
    )
}
