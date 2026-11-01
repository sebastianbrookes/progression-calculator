import { describe, expect, it } from "vitest"
import { DEFAULT_PERKS, NO_EFFECT_ID, drawPerk, type Perk } from "./perks"
import { DEFAULT_SETTINGS } from "./rules"
import { parsePerks, parseSettings } from "./stores"

const perk = (id: string, extra: Partial<Perk> = {}): Perk => ({
    id,
    name: id,
    effect: "",
    desc: "",
    duration: "",
    type: "buff",
    icon: "",
    ...extra,
})

describe("parseSettings", () => {
    it("fills in rules missing from older saves and drops bad values", () => {
        const parsed = parseSettings({ points_70: 50, mvp_badge: -2, steals_3: "4", unknown_rule: 9 })
        expect(parsed).toEqual({ ...DEFAULT_SETTINGS, points_70: 50 })
    })
})

describe("parsePerks", () => {
    it("reads the first version's bare array and drops its placeholder card", () => {
        const legacy = [
            { id: "spin_wheel", name: "Spin the Wheel", effect: "", desc: "", duration: "", type: "neutral", icon: "" },
            { id: "mine", name: "Mine", effect: "+1", desc: "", duration: "1 game", type: "", icon: "✨" },
        ]
        expect(parsePerks(legacy)).toEqual([perk("mine", { name: "Mine", effect: "+1", duration: "1 game", type: "neutral", icon: "✨" })])
    })

    it("adds default perks released after the player last saved", () => {
        const known = DEFAULT_PERKS.map((p) => p.id).filter((id) => id !== "linsanity")
        const parsed = parsePerks({ perks: [perk("mine")], knownDefaults: known })
        expect(parsed.map((p) => p.id)).toEqual(["mine", "linsanity"])
    })

    it("keeps defaults the player deleted on purpose deleted", () => {
        const parsed = parsePerks({ perks: [perk("mine")], knownDefaults: DEFAULT_PERKS.map((p) => p.id) })
        expect(parsed.map((p) => p.id)).toEqual(["mine"])
    })

    it("rejects data it doesn't recognise", () => {
        expect(() => parsePerks({ hello: 1 })).toThrow()
    })
})

describe("drawPerk", () => {
    const perks = [perk("a"), perk("b"), perk(NO_EFFECT_ID, { type: "neutral" })]

    it("lands on No Effect below the no-effect chance", () => {
        expect(drawPerk(perks, () => 0.1).id).toBe(NO_EFFECT_ID)
    })

    it("otherwise picks evenly from the other perks", () => {
        const rolls = [0.5, 0.0]
        expect(drawPerk(perks, () => rolls.shift()!).id).toBe("a")
        const rolls2 = [0.5, 0.99]
        expect(drawPerk(perks, () => rolls2.shift()!).id).toBe("b")
    })

    it("falls back to the default No Effect if the player has no perks left", () => {
        expect(drawPerk([], () => 0.9).id).toBe(NO_EFFECT_ID)
    })
})
