import type { PerkType } from "@/lib/perks"

export const PERK_TYPE_LABEL: Record<PerkType, string> = {
    buff: "Buff",
    nerf: "Nerf",
    neutral: "Neutral",
}

export const PERK_TYPE_TEXT: Record<PerkType, string> = {
    buff: "text-buff",
    nerf: "text-nerf",
    neutral: "text-neutral",
}

export const PERK_TYPE_BG: Record<PerkType, string> = {
    buff: "bg-buff",
    nerf: "bg-nerf",
    neutral: "bg-neutral",
}

// Backdrop for a revealed perk: a wash of its type colour rising from below.
export const PERK_TYPE_GLOW: Record<PerkType, string> = {
    buff: "from-buff/25 border-buff/60",
    nerf: "from-nerf/25 border-nerf/60",
    neutral: "from-neutral/15 border-neutral/40",
}
