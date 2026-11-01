"use client"

import { Switch } from "@/components/ui/switch"
import { preferencesStore } from "@/lib/stores"
import { useHydrated, useStore } from "@/lib/storage"
import { cn } from "@/lib/utils"

// Turns the perk spin on or off for every game, e.g. for a series without perks.
export function PerksToggle({ className }: { className?: string }) {
    const { perksEnabled } = useStore(preferencesStore)
    const hydrated = useHydrated()

    return (
        <label className={cn("flex cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 ring-1 ring-white/[0.08] ring-inset", className)}>
            <span>
                <span className="block text-sm text-foreground">Perks</span>
                <span className="block text-xs text-muted-foreground">
                    {!hydrated ? "\u00a0" : perksEnabled ? "Spin for a perk after each game" : "Off. Games go straight to results"}
                </span>
            </span>
            {/* Wait for the saved setting so the switch doesn't visibly flip on load. */}
            {hydrated ? (
                <Switch
                    checked={perksEnabled}
                    onCheckedChange={(on) => preferencesStore.set({ ...preferencesStore.get(), perksEnabled: on })}
                    className="ml-auto"
                />
            ) : (
                <span aria-hidden className="ml-auto h-6 w-11 shrink-0 rounded-full bg-white/10" />
            )}
        </label>
    )
}
