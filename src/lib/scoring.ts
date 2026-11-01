import { AWARDS, MULTI_DOUBLES, STAT_TIERS, STATS, type PointSettings, type StatLine } from "./rules"

export interface Game {
    stats: StatLine
    awards: string[]
}

export interface PointItem {
    label: string
    attr: number
    badge: number
}

export interface GameResult {
    items: PointItem[]
    attr: number
    badge: number
}

export function scoreGame({ stats, awards }: Game, settings: PointSettings): GameResult {
    const items: PointItem[] = []
    const add = (label: string, attr: number, badge = 0) => {
        if (attr > 0 || badge > 0) items.push({ label, attr, badge })
    }

    for (const { key, label } of STATS) {
        const tier = STAT_TIERS[key].find((t) => stats[key] >= t.min)
        if (tier) add(`${tier.min}+ ${label.toLowerCase()}`, settings[tier.setting])
    }

    const doubleFigures = STATS.filter(({ key }) => stats[key] >= 10).length
    const multi = MULTI_DOUBLES.find((m) => doubleFigures >= m.count)
    if (multi) add(multi.label, settings[multi.setting])

    for (const award of AWARDS) {
        if (awards.includes(award.id)) {
            add(award.label, settings[award.attr], award.badge ? settings[award.badge] : 0)
        }
    }

    return {
        items,
        attr: items.reduce((sum, i) => sum + i.attr, 0),
        badge: items.reduce((sum, i) => sum + i.badge, 0),
    }
}

// A game travels between the form, the spin, and the results as URL params,
// so a results page can be refreshed or shared.

export function gameToParams({ stats, awards }: Game, perkId?: string): URLSearchParams {
    const params = new URLSearchParams()
    for (const { key } of STATS) params.set(key, String(stats[key]))
    if (awards.length > 0) params.set("awards", awards.join(","))
    if (perkId) params.set("perk", perkId)
    return params
}

export function gameFromParams(params: URLSearchParams): Game {
    const stats = Object.fromEntries(STATS.map(({ key }) => [key, toCount(params.get(key))])) as StatLine
    const known = new Set(AWARDS.map((a) => a.id))
    const awards = (params.get("awards") ?? "").split(",").filter((id) => known.has(id))
    return { stats, awards }
}

export function toCount(value: string | null | undefined): number {
    const n = Number.parseInt(value ?? "", 10)
    return Number.isFinite(n) && n > 0 ? n : 0
}
