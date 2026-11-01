import { describe, expect, it } from "vitest"
import { DEFAULT_SETTINGS, type StatLine } from "./rules"
import { gameFromParams, gameToParams, scoreGame } from "./scoring"

const line = (s: Partial<StatLine>): StatLine => ({ points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, ...s })

describe("scoreGame", () => {
    it("scores a typical double-double with Player of the Game", () => {
        const result = scoreGame(
            { stats: line({ points: 34, rebounds: 11, assists: 4, steals: 2, blocks: 1 }), awards: ["player_of_the_game"] },
            DEFAULT_SETTINGS,
        )
        expect(result.items).toEqual([
            { label: "30+ points", attr: 3, badge: 0 },
            { label: "10+ rebounds", attr: 1, badge: 0 },
            { label: "Double-double", attr: 3, badge: 0 },
            { label: "Player of the Game", attr: 1, badge: 0 },
        ])
        expect(result).toMatchObject({ attr: 8, badge: 0 })
    })

    it("pays only the highest tier reached for each stat", () => {
        const result = scoreGame({ stats: line({ points: 71, steals: 6 }), awards: [] }, DEFAULT_SETTINGS)
        expect(result.items.map((i) => i.label)).toEqual(["70+ points", "6+ steals"])
        expect(result.attr).toBe(23)
    })

    it("counts multi-doubles across all five stats", () => {
        const all10 = line({ points: 10, rebounds: 10, assists: 10, steals: 10, blocks: 10 })
        expect(scoreGame({ stats: all10, awards: [] }, DEFAULT_SETTINGS).items.at(-1)).toEqual({
            label: "Quintuple-double",
            attr: 30,
            badge: 0,
        })
        const triple = line({ points: 10, rebounds: 10, assists: 10 })
        expect(scoreGame({ stats: triple, awards: [] }, DEFAULT_SETTINGS).items.at(-1)?.label).toBe("Triple-double")
    })

    it("gives season awards both attribute and badge points", () => {
        const result = scoreGame({ stats: line({}), awards: ["mvp", "champion"] }, DEFAULT_SETTINGS)
        expect(result).toMatchObject({ attr: 25, badge: 5 })
    })

    it("skips rules whose value is set to zero", () => {
        const result = scoreGame({ stats: line({ points: 12 }), awards: [] }, { ...DEFAULT_SETTINGS, points_10: 0 })
        expect(result.items).toEqual([])
    })
})

describe("game params", () => {
    it("round-trips a game and perk through the URL", () => {
        const game = { stats: line({ points: 34, rebounds: 11 }), awards: ["mvp", "roty"] }
        const params = gameToParams(game, "linsanity")
        expect(params.toString()).toBe("points=34&rebounds=11&assists=0&steals=0&blocks=0&awards=mvp%2Croty&perk=linsanity")
        expect(gameFromParams(params)).toEqual(game)
    })

    it("reads links from the first version of the app", () => {
        const game = gameFromParams(new URLSearchParams("points=20&rebounds=3&assists=&awards=player_of_the_game,dpoy"))
        expect(game).toEqual({ stats: line({ points: 20, rebounds: 3 }), awards: ["player_of_the_game", "dpoy"] })
    })

    it("ignores negative, junk, and unknown values", () => {
        const game = gameFromParams(new URLSearchParams("points=-5&rebounds=abc&awards=mvp,bogus"))
        expect(game).toEqual({ stats: line({}), awards: ["mvp"] })
    })
})
