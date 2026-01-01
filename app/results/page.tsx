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
    Star
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getPointSettings, PointSettings, DEFAULT_SETTINGS } from "@/lib/pointSettingsStorage"

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
        if (stats.points >= 70) addAttr("70+ Points Game", loadedSettings.points_70)
        else if (stats.points >= 60) addAttr("60+ Points Game", loadedSettings.points_60)
        else if (stats.points >= 50) addAttr("50+ Points Game", loadedSettings.points_50)
        else if (stats.points >= 40) addAttr("40+ Points Game", loadedSettings.points_40)
        else if (stats.points >= 30) addAttr("30+ Points Game", loadedSettings.points_30)
        else if (stats.points >= 20) addAttr("20+ Points Game", loadedSettings.points_20)
        else if (stats.points >= 10) addAttr("10+ Points Game", loadedSettings.points_10)

        // --- Rebounds ---
        if (stats.rebounds >= 20) addAttr("20+ Rebounds Game", loadedSettings.rebounds_20)
        else if (stats.rebounds >= 10) addAttr("10+ Rebounds Game", loadedSettings.rebounds_10)

        // --- Assists ---
        if (stats.assists >= 20) addAttr("20+ Assists Game", loadedSettings.assists_20)
        else if (stats.assists >= 10) addAttr("10+ Assists Game", loadedSettings.assists_10)

        // --- Steals ---
        if (stats.steals >= 10) addAttr("10+ Steals Game", loadedSettings.steals_10)
        else if (stats.steals >= 6) addAttr("6+ Steals Game", loadedSettings.steals_6)
        else if (stats.steals >= 3) addAttr("3+ Steals Game", loadedSettings.steals_3)

        // --- Blocks ---
        if (stats.blocks >= 10) addAttr("10+ Blocks Game", loadedSettings.blocks_10)
        else if (stats.blocks >= 6) addAttr("6+ Blocks Game", loadedSettings.blocks_6)
        else if (stats.blocks >= 3) addAttr("3+ Blocks Game", loadedSettings.blocks_3)

        // --- Double/Triple Doubles ---
        // count categories >= 10
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
        if (stats.awards.includes("player_of_the_game")) addAttr("Player of the Game", loadedSettings.player_of_the_game)
        if (stats.awards.includes("player_of_the_week")) addAttr("Player of the Week", loadedSettings.player_of_the_week)
        if (stats.awards.includes("player_of_the_month")) addAttr("Player of the Month", loadedSettings.player_of_the_month)
        if (stats.awards.includes("rookie_of_the_month")) addAttr("Rookie of the Month", loadedSettings.rookie_of_the_month)

        // Season Awards (Attr + Badge)
        if (stats.awards.includes("roty")) {
            addAttr("Rookie of the Year (ROTY)", loadedSettings.roty_points)
            addBadge("Rookie of the Year (ROTY)", loadedSettings.roty_badge)
        }
        if (stats.awards.includes("dpoy")) {
            addAttr("Defensive Player of the Year (DPOY)", loadedSettings.dpoy_points)
            addBadge("Defensive Player of the Year (DPOY)", loadedSettings.dpoy_badge)
        }
        if (stats.awards.includes("mvp")) {
            addAttr("Most Valuable Player (MVP)", loadedSettings.mvp_points)
            addBadge("Most Valuable Player (MVP)", loadedSettings.mvp_badge)
        }
        if (stats.awards.includes("champion")) {
            addAttr("Champion", loadedSettings.champion_points)
            addBadge("Champion", loadedSettings.champion_badge)
        }

        setBreakdown(newBreakdown)
        setTotals({ attr: attrPoints, badge: badgePoints })

    }, [stats])

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <Trophy className="size-10 text-orange-500" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
                        Points Earned
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                        Here's a breakdown of the development and badge points earned from this game.
                    </p>
                </div>

                {/* Game Summary */}
                <Card className="mb-6">
                    <CardContent className="pt-0">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground">Game Statistics Summary</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-5 text-center">
                            <div>
                                <div className="text-2xl font-bold">{stats.points}</div>
                                <div className="text-xs text-muted-foreground uppercase">PTS</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.rebounds}</div>
                                <div className="text-xs text-muted-foreground uppercase">REB</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.assists}</div>
                                <div className="text-xs text-muted-foreground uppercase">AST</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.steals}</div>
                                <div className="text-xs text-muted-foreground uppercase">STL</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stats.blocks}</div>
                                <div className="text-xs text-muted-foreground uppercase">BLK</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Points Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <Card className="bg-orange-50/50 border-orange-100 dark:bg-orange-950/10 dark:border-orange-900/50">
                        <CardContent className="flex flex-col items-center justify-center py-10">
                            <TrendingUp className="size-8 text-orange-500 mb-4" />
                            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                                {totals.attr}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">Attribute Points</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-amber-50/50 border-amber-100 dark:bg-amber-950/10 dark:border-amber-900/50">
                        <CardContent className="flex flex-col items-center justify-center py-10">
                            <Award className="size-8 text-amber-500 mb-4" />
                            <div className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                                {totals.badge}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">Badge Points</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Breakdown */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <h3 className="font-semibold text-lg mb-1">Points Breakdown</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Detailed breakdown of how your points were calculated
                        </p>

                        <div className="space-y-4">
                            {breakdown.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No points earned from this game.
                                </p>
                            ) : (
                                breakdown.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0 border-border/50">
                                        <span className="text-sm font-medium">{item.description}</span>
                                        <span className={`text-sm font-bold ${item.type === 'attr' ? 'text-orange-600 dark:text-orange-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                            +{item.points} {item.type}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        size="lg"
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={() => router.push("/game-stats")}
                    >
                        <RotateCcw className="size-4 mr-2" />
                        Enter Another Game
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        asChild
                    >
                        <Link href="/">
                            <Home className="size-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default function ResultsPage() {
    return (
        <React.Suspense fallback={<div>Loading stats...</div>}>
            <ResultsContent />
        </React.Suspense>
    )
}
