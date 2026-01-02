"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, RotateCcw, Save, Target, Trophy, Medal, Shield, Crown, Star, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    PointSettings,
    DEFAULT_SETTINGS,
    getPointSettings,
    savePointSettings,
    resetPointSettings
} from "@/lib/pointSettingsStorage"

interface SettingField {
    key: keyof PointSettings
    label: string
}

const scoringFields: SettingField[] = [
    { key: "points_70", label: "70+ Points Game" },
    { key: "points_60", label: "60+ Points Game" },
    { key: "points_50", label: "50+ Points Game" },
    { key: "points_40", label: "40+ Points Game" },
    { key: "points_30", label: "30+ Points Game" },
    { key: "points_20", label: "20+ Points Game" },
    { key: "points_10", label: "10+ Points Game" },
]

const reboundsFields: SettingField[] = [
    { key: "rebounds_20", label: "20+ Rebounds Game" },
    { key: "rebounds_10", label: "10+ Rebounds Game" },
]

const assistsFields: SettingField[] = [
    { key: "assists_20", label: "20+ Assists Game" },
    { key: "assists_10", label: "10+ Assists Game" },
]

const stealsFields: SettingField[] = [
    { key: "steals_10", label: "10+ Steals Game" },
    { key: "steals_6", label: "6+ Steals Game" },
    { key: "steals_3", label: "3+ Steals Game" },
]

const blocksFields: SettingField[] = [
    { key: "blocks_10", label: "10+ Blocks Game" },
    { key: "blocks_6", label: "6+ Blocks Game" },
    { key: "blocks_3", label: "3+ Blocks Game" },
]

const multipleDoublesFields: SettingField[] = [
    { key: "double_double_2", label: "Double-Double" },
    { key: "double_double_3", label: "Triple-Double" },
    { key: "double_double_4", label: "Quadruple-Double" },
    { key: "double_double_5", label: "Quintuple-Double" },
]

const playerAwardsFields: SettingField[] = [
    { key: "player_of_the_game", label: "Player of the Game" },
    { key: "player_of_the_week", label: "Player of the Week" },
    { key: "player_of_the_month", label: "Player of the Month" },
    { key: "rookie_of_the_month", label: "Rookie of the Month" },
]

const seasonAwardsPointsFields: SettingField[] = [
    { key: "roty_points", label: "Rookie of the Year (ROTY)" },
    { key: "dpoy_points", label: "Defensive Player of the Year (DPOY)" },
    { key: "mvp_points", label: "Most Valuable Player (MVP)" },
    { key: "champion_points", label: "Championship" },
]

const seasonAwardsBadgeFields: SettingField[] = [
    { key: "roty_badge", label: "Rookie of the Year (ROTY)" },
    { key: "dpoy_badge", label: "Defensive Player of the Year (DPOY)" },
    { key: "mvp_badge", label: "Most Valuable Player (MVP)" },
    { key: "champion_badge", label: "Championship" },
]

interface SettingsSectionProps {
    title: string
    icon: React.ReactNode
    fields: SettingField[]
    settings: PointSettings
    onChange: (key: keyof PointSettings, value: number) => void
    columns?: number
}

function SettingsSection({ title, icon, fields, settings, onChange, columns = 2 }: SettingsSectionProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                {icon}
                <span>{title}</span>
            </div>
            <div className={`grid grid-cols-1 ${columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
                {fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key} className="text-xs">
                            {field.label}
                        </Label>
                        <Input
                            id={field.key}
                            type="number"
                            min={0}
                            value={settings[field.key] === 0 ? '' : settings[field.key]}
                            onChange={(e) => {
                                const val = e.target.value;
                                onChange(field.key, val === '' ? 0 : parseInt(val) || 0);
                            }}
                            placeholder="0"
                            className="h-9"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function CustomizePage() {
    const [settings, setSettings] = React.useState<PointSettings>(DEFAULT_SETTINGS)
    const [isSaved, setIsSaved] = React.useState(false)
    const [isLoaded, setIsLoaded] = React.useState(false)

    React.useEffect(() => {
        setSettings(getPointSettings())
        setIsLoaded(true)
    }, [])

    const handleChange = (key: keyof PointSettings, value: number) => {
        setSettings(prev => ({ ...prev, [key]: value }))
        setIsSaved(false)
    }

    const handleSave = () => {
        savePointSettings(settings)
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 2000)
    }

    const handleRevert = () => {
        resetPointSettings()
        setSettings(DEFAULT_SETTINGS)
        setIsSaved(false)
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-background py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-muted-foreground">Loading settings...</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
                        Point System Settings
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                        Customize how attribute and badge points are calculated based on your game performance.
                    </p>
                </div>

                {/* Main Card */}
                <Card className="mb-6">
                    <CardHeader className="border-b">
                        <CardTitle className="flex items-center gap-2">
                            <Target className="size-5 text-primary" />
                            Customize Your Point System
                        </CardTitle>
                        <CardDescription>
                            Adjust the point values for each performance threshold below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-8">
                        {/* Scoring Thresholds */}
                        <SettingsSection
                            title="Scoring Thresholds"
                            icon={<Target className="size-4" />}
                            fields={scoringFields}
                            settings={settings}
                            onChange={handleChange}
                            columns={3}
                        />

                        <div className="border-t pt-6" />

                        {/* Rebounds & Assists */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <SettingsSection
                                title="Rebounds Thresholds"
                                icon={<Target className="size-4" />}
                                fields={reboundsFields}
                                settings={settings}
                                onChange={handleChange}
                            />
                            <SettingsSection
                                title="Assists Thresholds"
                                icon={<Target className="size-4" />}
                                fields={assistsFields}
                                settings={settings}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="border-t pt-6" />

                        {/* Steals & Blocks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <SettingsSection
                                title="Steals Thresholds"
                                icon={<Shield className="size-4" />}
                                fields={stealsFields}
                                settings={settings}
                                onChange={handleChange}
                            />
                            <SettingsSection
                                title="Blocks Thresholds"
                                icon={<Shield className="size-4" />}
                                fields={blocksFields}
                                settings={settings}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="border-t pt-6" />

                        {/* Multiple Doubles */}
                        <SettingsSection
                            title="Multiple Doubles Bonuses"
                            icon={<Trophy className="size-4" />}
                            fields={multipleDoublesFields}
                            settings={settings}
                            onChange={handleChange}
                        />

                        <div className="border-t pt-6" />

                        {/* Player Awards */}
                        <SettingsSection
                            title="Player Awards (Attribute Points)"
                            icon={<Star className="size-4" />}
                            fields={playerAwardsFields}
                            settings={settings}
                            onChange={handleChange}
                        />

                        <div className="border-t pt-6" />

                        {/* Season Awards - Points */}
                        <SettingsSection
                            title="Season Awards (Attribute Points)"
                            icon={<Crown className="size-4" />}
                            fields={seasonAwardsPointsFields}
                            settings={settings}
                            onChange={handleChange}
                        />

                        <div className="border-t pt-6" />

                        {/* Season Awards - Badges */}
                        <SettingsSection
                            title="Season Awards (Badge Points)"
                            icon={<Medal className="size-4" />}
                            fields={seasonAwardsBadgeFields}
                            settings={settings}
                            onChange={handleChange}
                        />

                        <div className="border-t pt-6" />

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Button onClick={handleSave} className="gap-2">
                                <Save className="size-4" />
                                {isSaved ? "Saved!" : "Save Settings"}
                            </Button>
                            <Button variant="destructive" onClick={handleRevert} className="gap-2">
                                <RotateCcw className="size-4" />
                                Revert to Default
                            </Button>
                            <Button variant="outline" asChild className="ml-auto">
                                <Link href="/game-stats" className="flex items-center gap-2">
                                    <ArrowLeft className="size-4" />
                                    Back to Game Stats
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
