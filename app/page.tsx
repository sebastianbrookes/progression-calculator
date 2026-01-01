"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    Star,
    Award,
    Trophy,
    Medal,
    Shield,
    Crown,
    Settings
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface AwardOption {
    id: string
    label: string
    icon: React.ReactNode
}

const awards: AwardOption[] = [
    { id: "player_of_the_game", label: "Player of the Game", icon: <Star className="size-4" /> },
    { id: "player_of_the_week", label: "Player of the Week", icon: <Award className="size-4" /> },
    { id: "player_of_the_month", label: "Player of the Month", icon: <Trophy className="size-4" /> },
    { id: "rookie_of_the_month", label: "Rookie of the Month", icon: <Star className="size-4" /> },
    { id: "roty", label: "Rookie of the Year (ROTY)", icon: <Medal className="size-4" /> },
    { id: "dpoy", label: "Defensive Player of the Year (DPOY)", icon: <Shield className="size-4" /> },
    { id: "mvp", label: "Most Valuable Player (MVP)", icon: <Crown className="size-4" /> },
    { id: "champion", label: "Champion", icon: <Trophy className="size-4" /> },
]

export default function GameStatsPage() {
    const router = useRouter()
    const [stats, setStats] = React.useState({
        points: "" as string | number,
        rebounds: "" as string | number,
        assists: "" as string | number,
        steals: "" as string | number,
        blocks: "" as string | number
    })

    const [selectedAwards, setSelectedAwards] = React.useState<Record<string, boolean>>({})

    const handleStatChange = (field: keyof typeof stats) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setStats(prev => ({
            ...prev,
            [field]: value === "" ? "" : parseInt(value) || 0
        }))
    }

    const handleAwardToggle = (awardId: string) => (checked: boolean) => {
        setSelectedAwards(prev => ({
            ...prev,
            [awardId]: checked
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Convert empty strings to 0 for submission if needed
        const submissionStats = Object.fromEntries(
            Object.entries(stats).map(([key, val]) => [key, val === "" ? 0 : val])
        )

        const params = new URLSearchParams()
        Object.entries(submissionStats).forEach(([key, value]) => {
            params.append(key, value.toString())
        })

        const activeAwards = Object.entries(selectedAwards)
            .filter(([_, isSelected]) => isSelected)
            .map(([key]) => key)

        if (activeAwards.length > 0) {
            params.append("awards", activeAwards.join(","))
        }

        router.push(`/results?${params.toString()}`)
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
                        Progression Point Calculator
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                        Enter your performance stats after each game to generate development and badge points.
                    </p>
                </div>

                {/* Main Form Card */}
                <Card className="mb-6">
                    <CardHeader className="border-b">
                        <CardTitle>Game Stats Entry</CardTitle>
                        <CardDescription>
                            Input your game statistics below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit}>
                            {/* Game Statistics Section */}
                            <div className="mb-8">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Game Statistics</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="points">Points</Label>
                                        <Input
                                            id="points"
                                            type="number"
                                            value={stats.points}
                                            onChange={handleStatChange("points")}
                                            placeholder="0"
                                            min={0}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rebounds">Rebounds</Label>
                                        <Input
                                            id="rebounds"
                                            type="number"
                                            value={stats.rebounds}
                                            onChange={handleStatChange("rebounds")}
                                            placeholder="0"
                                            min={0}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="assists">Assists</Label>
                                        <Input
                                            id="assists"
                                            type="number"
                                            value={stats.assists}
                                            onChange={handleStatChange("assists")}
                                            placeholder="0"
                                            min={0}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="steals">Steals</Label>
                                        <Input
                                            id="steals"
                                            type="number"
                                            value={stats.steals}
                                            onChange={handleStatChange("steals")}
                                            placeholder="0"
                                            min={0}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="blocks">Blocks</Label>
                                        <Input
                                            id="blocks"
                                            type="number"
                                            value={stats.blocks}
                                            onChange={handleStatChange("blocks")}
                                            placeholder="0"
                                            min={0}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Awards Section */}
                            <div className="mb-8">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Additional Awards</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {awards.map((award) => (
                                        <label
                                            key={award.id}
                                            htmlFor={award.id}
                                            className="flex items-center gap-3 p-3 rounded-md border border-input bg-background hover:bg-accent/50 cursor-pointer transition-colors"
                                        >
                                            <Checkbox
                                                id={award.id}
                                                checked={selectedAwards[award.id] || false}
                                                onCheckedChange={handleAwardToggle(award.id)}
                                            />
                                            <span className="text-muted-foreground">{award.icon}</span>
                                            <span className="text-sm font-medium">{award.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3">
                                <Button type="submit" className="bg-primary hover:bg-primary/90">
                                    Submit Stats
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/customize" className="flex items-center gap-2">
                                        <Settings className="size-4" />
                                        Customize Point Settings
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center text-sm text-muted-foreground mt-8 space-y-2">
                    <p>Made for Peeweedaplug's Brooklyn Nets series.</p>
                    <p>
                        Shoutout to Jonas Dockx, the creator of{" "}
                        <a
                            href="https://www.nba2kpt.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            nba2kpt.com
                        </a>
                        . This calculator wouldn't have been possible without his work.
                    </p>
                    <p>
                        Message me on{" "}
                        <a
                            href="https://x.com/sbrookesss"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            Twitter
                        </a>{" "}
                        for feedback and recommendations.
                    </p>

                </div>
            </div>
        </div>
    )
}
