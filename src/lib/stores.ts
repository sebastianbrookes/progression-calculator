import { DEFAULT_PERKS, type Perk, type PerkType } from "./perks"
import { DEFAULT_SETTINGS, type PointSettings, type SettingKey } from "./rules"
import { createStore } from "./storage"

// Storage keys are unchanged from the first version of the app so existing
// players keep their saved rules and perks.

export const settingsStore = createStore<PointSettings>({
    key: "nba2k_point_settings",
    fallback: DEFAULT_SETTINGS,
    parse: parseSettings,
})

export function parseSettings(raw: unknown): PointSettings {
    const settings = { ...DEFAULT_SETTINGS }
    if (raw && typeof raw === "object") {
        for (const key of Object.keys(DEFAULT_SETTINGS) as SettingKey[]) {
            const value = (raw as Record<string, unknown>)[key]
            if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
                settings[key] = Math.floor(value)
            }
        }
    }
    return settings
}

// Perks are stored as the player's full list plus the ids of the default
// perks that existed when they last saved. That way a default perk added in
// a later release shows up for them, while defaults they deleted stay gone.
interface StoredPerks {
    perks: unknown[]
    knownDefaults: string[]
}

export const perksStore = createStore<Perk[]>({
    key: "nba2k_custom_perks",
    fallback: DEFAULT_PERKS,
    parse: parsePerks,
    serialize: (perks): StoredPerks => ({
        perks,
        knownDefaults: DEFAULT_PERKS.map((p) => p.id),
    }),
})

const PERK_TYPES: PerkType[] = ["buff", "nerf", "neutral"]

export function parsePerks(raw: unknown): Perk[] {
    let stored: unknown[]
    let knownDefaults: Set<string>
    if (Array.isArray(raw)) {
        // First version: a bare array. We can't tell which defaults were
        // deleted on purpose, so take the list as-is.
        stored = raw
        knownDefaults = new Set(DEFAULT_PERKS.map((p) => p.id))
    } else if (raw && typeof raw === "object" && Array.isArray((raw as StoredPerks).perks)) {
        stored = (raw as StoredPerks).perks
        knownDefaults = new Set((raw as StoredPerks).knownDefaults ?? [])
    } else {
        throw new Error("Unrecognised perks format")
    }

    const perks = stored.flatMap((p) => {
        const perk = toPerk(p)
        return perk ? [perk] : []
    })
    const ids = new Set(perks.map((p) => p.id))
    const added = DEFAULT_PERKS.filter((p) => !knownDefaults.has(p.id) && !ids.has(p.id))
    return [...perks, ...added]
}

function toPerk(value: unknown): Perk | null {
    if (!value || typeof value !== "object") return null
    const v = value as Record<string, unknown>
    // "spin_wheel" was a placeholder card the first version kept in the list.
    if (typeof v.id !== "string" || v.id === "spin_wheel") return null
    const str = (x: unknown) => (typeof x === "string" ? x : "")
    return {
        id: v.id,
        name: str(v.name),
        effect: str(v.effect),
        desc: str(v.desc),
        duration: str(v.duration),
        type: PERK_TYPES.includes(v.type as PerkType) ? (v.type as PerkType) : "neutral",
        icon: str(v.icon),
    }
}

// Whether the player has finished or skipped the first-visit tour. A new key,
// so players from the previous version see the tour once too.
export const tourStore = createStore<boolean>({
    key: "progression_tour_seen",
    fallback: false,
    parse: (raw) => raw === true,
})

export interface Preferences {
    // Off skips the perk spin entirely: games go straight to results.
    perksEnabled: boolean
}

const DEFAULT_PREFERENCES: Preferences = { perksEnabled: true }

export const preferencesStore = createStore<Preferences>({
    key: "progression_preferences",
    fallback: DEFAULT_PREFERENCES,
    parse: (raw) => ({
        perksEnabled:
            raw && typeof raw === "object" && typeof (raw as Preferences).perksEnabled === "boolean"
                ? (raw as Preferences).perksEnabled
                : DEFAULT_PREFERENCES.perksEnabled,
    }),
})
