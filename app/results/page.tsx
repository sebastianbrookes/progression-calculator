"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
    Trophy,
    TrendingUp,
    Award,
    Home,
    RotateCcw,
    Zap,
    Target,
    Clock
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getPointSettings, PointSettings, DEFAULT_SETTINGS } from "@/lib/pointSettingsStorage"
import { getPerkById, Perk } from "@/lib/perks"

interface BreakdownItem {
    description: string
    points: number
    type: "attr" | "badge"
}

function ResultsContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [breakdown, setBreakdown] = React.useState<BreakdownItem[]>([])
    const [totals, setTotals] = React.useState({ attr: 0, badge: 0 })
    const [settings, setSettings] = React.useState<PointSettings>(DEFAULT_SETTINGS)
    const [perk, setPerk] = React.useState<Perk | null>(null)

    // Parse params
    const stats = React.useMemo(() => ({
        points: parseInt(searchParams.get("points") || "0"),
        rebounds: parseInt(searchParams.get("rebounds") || "0"),
        assists: parseInt(searchParams.get("assists") || "0"),
        steals: parseInt(searchParams.get("steals") || "0"),
        blocks: parseInt(searchParams.get("blocks") || "0"),
        awards: (searchParams.get("awards") || "").split(",").filter(Boolean)
    }), [searchParams])

    React.useEffect(() => {
        // Load perk from URL
        const perkId = searchParams.get("perk")
        if (perkId) {
            const foundPerk = getPerkById(perkId)
            if (foundPerk) setPerk(foundPerk)
        }

        // Load settings
        const loadedSettings = getPointSettings()
        setSettings(loadedSettings)

        // Calculate Points
        const newBreakdown: BreakdownItem[] = []
        let attrPoints = 0
        let badgePoints = 0

        // Helper to add points
        const addAttr = (desc: string, pts: number) => {
            if (pts > 0) {
                newBreakdown.push({ description: desc, points: pts, type: "attr" })
                attrPoints += pts
            }
        }
        const addBadge = (desc: string, pts: number) => {
            if (pts > 0) {
                newBreakdown.push({ description: desc, points: pts, type: "badge" })
                badgePoints += pts
            }
        }

        // --- Scoring ---
        if (stats.points >= 70) addAttr("70+ Points", loadedSettings.points_70)
        else if (stats.points >= 60) addAttr("60+ Points", loadedSettings.points_60)
        else if (stats.points >= 50) addAttr("50+ Points", loadedSettings.points_50)
        else if (stats.points >= 40) addAttr("40+ Points", loadedSettings.points_40)
        else if (stats.points >= 30) addAttr("30+ Points", loadedSettings.points_30)
        else if (stats.points >= 20) addAttr("20+ Points", loadedSettings.points_20)
        else if (stats.points >= 10) addAttr("10+ Points", loadedSettings.points_10)

        // --- Rebounds ---
        if (stats.rebounds >= 20) addAttr("20+ Rebounds", loadedSettings.rebounds_20)
        else if (stats.rebounds >= 10) addAttr("10+ Rebounds", loadedSettings.rebounds_10)

        // --- Assists ---
        if (stats.assists >= 20) addAttr("20+ Assists", loadedSettings.assists_20)
        else if (stats.assists >= 10) addAttr("10+ Assists", loadedSettings.assists_10)

        // --- Steals ---
        if (stats.steals >= 10) addAttr("10+ Steals", loadedSettings.steals_10)
        else if (stats.steals >= 6) addAttr("6+ Steals", loadedSettings.steals_6)
        else if (stats.steals >= 3) addAttr("3+ Steals", loadedSettings.steals_3)

        // --- Blocks ---
        if (stats.blocks >= 10) addAttr("10+ Blocks", loadedSettings.blocks_10)
        else if (stats.blocks >= 6) addAttr("6+ Blocks", loadedSettings.blocks_6)
        else if (stats.blocks >= 3) addAttr("3+ Blocks", loadedSettings.blocks_3)

        // --- Double/Triple Doubles ---
        const categories10Plus = [
            stats.points >= 10,
            stats.rebounds >= 10,
            stats.assists >= 10,
            stats.steals >= 10,
            stats.blocks >= 10
        ].filter(Boolean).length

        if (categories10Plus >= 5) addAttr("Quintuple Double", loadedSettings.double_double_5)
        else if (categories10Plus >= 4) addAttr("Quadruple Double", loadedSettings.double_double_4)
        else if (categories10Plus >= 3) addAttr("Triple Double", loadedSettings.double_double_3)
        else if (categories10Plus >= 2) addAttr("Double Double", loadedSettings.double_double_2)

        // --- Awards ---
        if (stats.awards.includes("player_of_the_game")) addAttr("POTG", loadedSettings.player_of_the_game)
        if (stats.awards.includes("player_of_the_week")) addAttr("POTW", loadedSettings.player_of_the_week)
        if (stats.awards.includes("player_of_the_month")) addAttr("POTM", loadedSettings.player_of_the_month)
        if (stats.awards.includes("rookie_of_the_month")) addAttr("ROM", loadedSettings.rookie_of_the_month)

        // Season Awards (Attr + Badge)
        if (stats.awards.includes("roty")) {
            addAttr("ROTY", loadedSettings.roty_points)
            addBadge("ROTY", loadedSettings.roty_badge)
        }
        if (stats.awards.includes("dpoy")) {
            addAttr("DPOY", loadedSettings.dpoy_points)
            addBadge("DPOY", loadedSettings.dpoy_badge)
        }
        if (stats.awards.includes("mvp")) {
            addAttr("MVP", loadedSettings.mvp_points)
            addBadge("MVP", loadedSettings.mvp_badge)
        }
        if (stats.awards.includes("champion")) {
            addAttr("Champion", loadedSettings.champion_points)
            addBadge("Champion", loadedSettings.champion_badge)
        }

        setBreakdown(newBreakdown)
        setTotals({ attr: attrPoints, badge: badgePoints })

    }, [stats, searchParams])

    const getPerkColor = (type: Perk["type"]) => {
        switch (type) {
            case "buff":
                return "from-emerald-500/20 to-green-500/20 border-emerald-500/50 dark:from-emerald-500/10 dark:to-green-500/10"
            case "nerf":
                return "from-red-500/20 to-orange-500/20 border-red-500/50 dark:from-red-500/10 dark:to-orange-500/10"
            case "neutral":
                return "from-gray-500/20 to-slate-500/20 border-gray-500/50 dark:from-gray-500/10 dark:to-slate-500/10"
        }
    }

    const getPerkTextColor = (type: Perk["type"]) => {
        switch (type) {
            case "buff":
                return "text-emerald-600 dark:text-emerald-400"
            case "nerf":
                return "text-red-600 dark:text-red-400"
            case "neutral":
                return "text-gray-600 dark:text-gray-400"
        }
    }

    return (
        <div className="min-h-screen md:h-screen bg-background p-4 md:p-6 overflow-y-auto md:overflow-hidden">
            <div className="h-full max-w-6xl mx-auto flex flex-col">
                {/* Compact Header */}
                <div className="flex items-center justify-between mb-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/10">
                            <Trophy className="size-5 text-orange-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-foreground">
                                Game Results
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Points earned from this game
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                        >
                            <Link href="/">
                                <Home className="size-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Bento Grid - Mobile uses flex column, Desktop uses fixed grid */}
                <div className="flex-1 flex flex-col gap-3 md:grid md:grid-cols-12 md:grid-rows-6 md:min-h-0">
                    {/* Game Stats - Top Left (spans 4 cols, 2 rows) */}
                    <Card className="col-span-12 md:col-span-4 md:row-span-2 flex flex-col">
                        <CardContent className="flex-1 p-4 flex flex-col">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Game Stats</p>
                            <div className="flex-1 grid grid-cols-5 gap-2">
                                <div className="flex flex-col items-center justify-center py-2 md:py-0">
                                    <div className="text-2xl font-bold">{stats.points}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase">PTS</div>
                                </div>
                                <div className="flex flex-col items-center justify-center py-2 md:py-0">
                                    <div className="text-2xl font-bold">{stats.rebounds}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase">REB</div>
                                </div>
                                <div className="flex flex-col items-center justify-center py-2 md:py-0">
                                    <div className="text-2xl font-bold">{stats.assists}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase">AST</div>
                                </div>
                                <div className="flex flex-col items-center justify-center py-2 md:py-0">
                                    <div className="text-2xl font-bold">{stats.steals}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase">STL</div>
                                </div>
                                <div className="flex flex-col items-center justify-center py-2 md:py-0">
                                    <div className="text-2xl font-bold">{stats.blocks}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase">BLK</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Points Summary Row - Mobile shows side by side */}
                    <div className="grid grid-cols-2 gap-3 md:contents">
                        {/* Attribute Points - Top Middle (spans 4 cols, 2 rows) */}
                        <Card className="md:col-span-4 md:row-span-2 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/30">
                            <CardContent className="h-full p-4 flex flex-col items-center justify-center min-h-[120px] md:min-h-0">
                                <TrendingUp className="size-5 md:size-6 text-orange-500 mb-2" />
                                <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400">
                                    {totals.attr}
                                </div>
                                <div className="text-[10px] md:text-xs text-muted-foreground font-medium text-center">Attribute Points</div>
                            </CardContent>
                        </Card>

                        {/* Badge Points - Top Right (spans 4 cols, 2 rows) */}
                        <Card className="md:col-span-4 md:row-span-2 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/30">
                            <CardContent className="h-full p-4 flex flex-col items-center justify-center min-h-[120px] md:min-h-0">
                                <Award className="size-5 md:size-6 text-amber-500 mb-2" />
                                <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400">
                                    {totals.badge}
                                </div>
                                <div className="text-[10px] md:text-xs text-muted-foreground font-medium text-center">Badge Points</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Breakdown - Left (spans 6 cols, 3 rows on desktop) */}
                    <Card className="col-span-12 md:col-span-6 md:row-span-3 flex flex-col">
                        <CardContent className="flex-1 p-4 flex flex-col min-h-0">
                            <div className="flex items-center gap-2 mb-3 shrink-0">
                                <Target className="size-4 text-muted-foreground" />
                                <h3 className="text-sm font-semibold">Points Breakdown</h3>
                            </div>
                            <div className="flex-1 md:overflow-y-auto min-h-0 pr-1">
                                {breakdown.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No points earned from this game.
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {breakdown.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between py-1.5 border-b last:border-0 border-border/50">
                                                <span className="text-sm">{item.description}</span>
                                                <span className={`text-sm font-bold ${item.type === 'attr' ? 'text-orange-600 dark:text-orange-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                                    +{item.points}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Perk Card - Right (spans 6 cols, 3 rows on desktop) */}
                    <Card className={`col-span-12 md:col-span-6 md:row-span-3 flex flex-col ${perk ? `bg-gradient-to-br ${getPerkColor(perk.type)} border-2` : ''}`}>
                        <CardContent className="flex-1 p-4 flex flex-col items-center justify-center min-h-[180px] md:min-h-0">
                            {perk ? (
                                <>
                                    <div className="text-4xl md:text-5xl mb-3">{perk.icon}</div>
                                    <h3 className={`text-base md:text-lg font-bold mb-1 ${getPerkTextColor(perk.type)}`}>
                                        {perk.name}
                                    </h3>
                                    <p className="text-sm text-center text-foreground mb-2 px-2">
                                        {perk.effect}
                                    </p>
                                    {perk.duration !== "0 games" && perk.duration !== "N/A" && (
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Clock className="size-3" />
                                            <span>{perk.duration}</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center">
                                    <Zap className="size-8 md:size-10 text-muted-foreground/50 mx-auto mb-3" />
                                    <p className="text-sm text-muted-foreground">No perk applied</p>
                                    <p className="text-xs text-muted-foreground/70 mt-1">Spin the wheel next time!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions - Bottom (spans full width, 1 row) */}
                    <div className="col-span-12 md:row-span-1 flex flex-col sm:flex-row items-center justify-center gap-3 py-4 md:py-0">
                        <Button
                            size="lg"
                            className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto"
                            onClick={() => router.push("/")}
                        >
                            <RotateCcw className="size-4 mr-2" />
                            Enter Another Game
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            asChild
                            className="w-full sm:w-auto"
                        >
                            <Link href="/">
                                <Home className="size-4 mr-2" />
                                Dashboard
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ResultsPage() {
    return (
        <React.Suspense fallback={<div className="h-screen flex items-center justify-center">Loading stats...</div>}>
            <ResultsContent />
        </React.Suspense>
    )
}
