"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, RotateCcw, Save, Plus, Trash2, Check, Sparkles, ChevronDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Perk, PERKS } from "@/lib/perks"
import { getCustomPerks, saveCustomPerks, resetCustomPerks } from "@/lib/perksStorage"

type PerkType = "" | "buff" | "nerf" | "neutral"

const perkTypeOptions: { value: PerkType; label: string; color: string }[] = [
    { value: "buff", label: "Buff", color: "text-green-500" },
    { value: "nerf", label: "Nerf", color: "text-red-500" },
    { value: "neutral", label: "Neutral", color: "text-gray-500" },
]

interface PerkCardProps {
    perk: Perk
    index: number
    onChange: (index: number, field: keyof Perk, value: string) => void
    onDelete: (index: number) => void
    isProtected?: boolean
}

function PerkCard({ perk, index, onChange, onDelete, isProtected }: PerkCardProps) {
    const typeColor = perk.type === "buff" ? "border-green-500/30 bg-green-500/5" :
        perk.type === "nerf" ? "border-red-500/30 bg-red-500/5" :
            perk.type === "neutral" ? "border-gray-500/30 bg-gray-500/5" :
                "border-amber-500/30 bg-amber-500/5"

    return (
        <div className={`p-4 rounded-lg border-2 ${typeColor} space-y-3`}>
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="space-y-1 flex-1">
                        <Label htmlFor={`${index}-icon`} className="text-xs text-muted-foreground">Icon</Label>
                        <Input
                            id={`${index}-icon`}
                            value={perk.icon}
                            onChange={(e) => onChange(index, "icon", e.target.value)}
                            placeholder="🎮"
                            className="h-8 w-16 text-center"
                            maxLength={2}
                        />
                    </div>
                    <div className="space-y-1 flex-[3]">
                        <Label htmlFor={`${index}-name`} className="text-xs text-muted-foreground">Name</Label>
                        <Input
                            id={`${index}-name`}
                            value={perk.name}
                            onChange={(e) => onChange(index, "name", e.target.value)}
                            placeholder="Perk Name"
                            className="h-8"
                            disabled={isProtected}
                        />
                    </div>
                </div>
                {!isProtected && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(index)}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <Label htmlFor={`${index}-effect`} className="text-xs text-muted-foreground">Effect</Label>
                    <Input
                        id={`${index}-effect`}
                        value={perk.effect}
                        onChange={(e) => onChange(index, "effect", e.target.value)}
                        placeholder="+5 to attribute"
                        className="h-8"
                    />
                </div>
                <div className="space-y-1">
                    <Label htmlFor={`${index}-duration`} className="text-xs text-muted-foreground">Duration</Label>
                    <Input
                        id={`${index}-duration`}
                        value={perk.duration}
                        onChange={(e) => onChange(index, "duration", e.target.value)}
                        placeholder="10 games"
                        className="h-8"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <Label htmlFor={`${index}-desc`} className="text-xs text-muted-foreground">Description (optional)</Label>
                <Input
                    id={`${index}-desc`}
                    value={perk.desc}
                    onChange={(e) => onChange(index, "desc", e.target.value)}
                    placeholder="Additional notes about this perk..."
                    className="h-8"
                />
            </div>

            <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Type</Label>
                <div className="flex gap-2">
                    {perkTypeOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(index, "type", option.value)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border
                                ${perk.type === option.value
                                    ? option.value === "buff"
                                        ? "bg-green-500/20 border-green-500 text-green-600 dark:text-green-400"
                                        : option.value === "nerf"
                                            ? "bg-red-500/20 border-red-500 text-red-600 dark:text-red-400"
                                            : "bg-gray-500/20 border-gray-500 text-gray-600 dark:text-gray-400"
                                    : "bg-background border-input hover:bg-accent"
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function PerksPage() {
    const [perks, setPerks] = React.useState<Perk[]>(PERKS)
    const [isSaved, setIsSaved] = React.useState(false)
    const [isReverted, setIsReverted] = React.useState(false)
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [newPerkIds, setNewPerkIds] = React.useState<Set<string>>(new Set())
    const [collapsedSections, setCollapsedSections] = React.useState({
        buffs: true,
        nerfs: true,
        neutral: true,
    })
    const [deleteConfirm, setDeleteConfirm] = React.useState<{ show: boolean; index: number | null }>({
        show: false,
        index: null,
    })

    React.useEffect(() => {
        setPerks(getCustomPerks())
        setIsLoaded(true)
    }, [])

    const handleChange = (index: number, field: keyof Perk, value: string) => {
        setPerks(prev => {
            const updated = [...prev]
            updated[index] = { ...updated[index], [field]: value }
            return updated
        })
        setIsSaved(false)
        setIsReverted(false)
    }

    const handleDelete = (index: number) => {
        setDeleteConfirm({ show: true, index })
    }

    const confirmDelete = () => {
        if (deleteConfirm.index !== null) {
            const perkToDelete = perks[deleteConfirm.index]
            setPerks(prev => prev.filter((_, i) => i !== deleteConfirm.index))
            // Remove from newPerkIds if it was a new perk
            if (perkToDelete && newPerkIds.has(perkToDelete.id)) {
                setNewPerkIds(prev => {
                    const updated = new Set(prev)
                    updated.delete(perkToDelete.id)
                    return updated
                })
            }
            setIsSaved(false)
            setIsReverted(false)
        }
        setDeleteConfirm({ show: false, index: null })
    }

    const cancelDelete = () => {
        setDeleteConfirm({ show: false, index: null })
    }

    const toggleSection = (section: 'buffs' | 'nerfs' | 'neutral') => {
        setCollapsedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    const handleAddPerk = () => {
        const newPerkId = `custom_${Date.now()}`
        const newPerk: Perk = {
            id: newPerkId,
            name: "New Perk",
            effect: "",
            desc: "",
            duration: "",
            type: "",
            icon: "✨"
        }
        setPerks(prev => [...prev, newPerk])
        // Track this as a new unsaved perk
        setNewPerkIds(prev => new Set(prev).add(newPerkId))
        setIsSaved(false)
        setIsReverted(false)
    }

    // Check if any new perks are missing a type selection
    const hasUncategorizedNewPerks = perks.some(p => newPerkIds.has(p.id) && p.type === "")

    const handleSave = () => {
        saveCustomPerks(perks)
        // Clear new perk tracking since they're now saved
        setNewPerkIds(new Set())
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 3000)
    }

    const handleRevert = () => {
        resetCustomPerks()
        setPerks(PERKS)
        // Clear new perk tracking
        setNewPerkIds(new Set())
        setIsSaved(false)
        setIsReverted(true)
        setTimeout(() => setIsReverted(false), 3000)
    }

    // Separate perks by type for organized display
    const newPerks = perks.filter(p => newPerkIds.has(p.id))
    const savedPerkIds = new Set(perks.filter(p => !newPerkIds.has(p.id)).map(p => p.id))
    const buffs = perks.filter(p => p.type === "buff" && p.id !== "spin_wheel" && savedPerkIds.has(p.id))
    const nerfs = perks.filter(p => p.type === "nerf" && savedPerkIds.has(p.id))
    const neutrals = perks.filter(p => p.type === "neutral" && p.id !== "spin_wheel" && savedPerkIds.has(p.id))

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-background py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-muted-foreground">Loading perks...</div>
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
                        Customize Perks
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                        Edit existing perks or add your own custom ones. Changes are saved locally.
                    </p>
                </div>

                {/* Main Card */}
                <Card className="mb-6">
                    <CardHeader className="border-b">
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="size-5 text-primary" />
                            Perk Editor
                        </CardTitle>
                        <CardDescription>
                            Customize perk names, effects, durations, and types.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {/* Add New Perk Button (Top) */}
                        <Button
                            variant="outline"
                            onClick={handleAddPerk}
                            className="w-full gap-2 border-dashed"
                        >
                            <Plus className="size-4" />
                            Add New Perk
                        </Button>

                        {/* Unsaved New Perks Section */}
                        {newPerks.length > 0 && (
                            <div className="space-y-4">
                                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <h3 className="text-sm font-medium text-primary flex items-center gap-2">
                                        <Sparkles className="size-4" />
                                        Unsaved New Perks ({newPerks.length})
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        These perks will be sorted into their categories after you save.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {newPerks.map((perk) => {
                                        const actualIndex = perks.findIndex(p => p.id === perk.id)
                                        return (
                                            <PerkCard
                                                key={perk.id}
                                                perk={perk}
                                                index={actualIndex}
                                                onChange={handleChange}
                                                onDelete={handleDelete}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Buffs Section */}
                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={() => toggleSection('buffs')}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                            >
                                <h3 className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-green-500"></span>
                                    Buffs ({buffs.length})
                                </h3>
                                <ChevronDown className={`size-4 text-green-600 dark:text-green-400 transition-transform ${!collapsedSections.buffs ? 'rotate-180' : ''}`} />
                            </button>
                            {!collapsedSections.buffs && (
                                <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {buffs.map((perk) => {
                                        const actualIndex = perks.findIndex(p => p.id === perk.id)
                                        return (
                                            <PerkCard
                                                key={perk.id}
                                                perk={perk}
                                                index={actualIndex}
                                                onChange={handleChange}
                                                onDelete={handleDelete}
                                            />
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Nerfs Section */}
                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={() => toggleSection('nerfs')}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                            >
                                <h3 className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-red-500"></span>
                                    Nerfs ({nerfs.length})
                                </h3>
                                <ChevronDown className={`size-4 text-red-600 dark:text-red-400 transition-transform ${!collapsedSections.nerfs ? 'rotate-180' : ''}`} />
                            </button>
                            {!collapsedSections.nerfs && (
                                <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {nerfs.map((perk) => {
                                        const actualIndex = perks.findIndex(p => p.id === perk.id)
                                        return (
                                            <PerkCard
                                                key={perk.id}
                                                perk={perk}
                                                index={actualIndex}
                                                onChange={handleChange}
                                                onDelete={handleDelete}
                                            />
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Neutral Section */}
                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={() => toggleSection('neutral')}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-500/10 border border-gray-500/20 hover:bg-gray-500/20 transition-colors"
                            >
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-gray-500"></span>
                                    Neutral ({neutrals.length})
                                </h3>
                                <ChevronDown className={`size-4 text-gray-600 dark:text-gray-400 transition-transform ${!collapsedSections.neutral ? 'rotate-180' : ''}`} />
                            </button>
                            {!collapsedSections.neutral && (
                                <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {neutrals.map((perk) => {
                                        const actualIndex = perks.findIndex(p => p.id === perk.id)
                                        return (
                                            <PerkCard
                                                key={perk.id}
                                                perk={perk}
                                                index={actualIndex}
                                                onChange={handleChange}
                                                onDelete={handleDelete}
                                                isProtected={perk.id === "no_effect"}
                                            />
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
                            <div className="flex flex-col gap-1">
                                <Button onClick={handleSave} className="gap-2" disabled={isSaved || hasUncategorizedNewPerks}>
                                    <Save className="size-4" />
                                    {isSaved ? "Saved!" : "Save Changes"}
                                </Button>
                                {hasUncategorizedNewPerks && (
                                    <span className="text-xs text-amber-600 dark:text-amber-400">
                                        Select a "type" for all new perks to save
                                    </span>
                                )}
                            </div>
                            <Button variant="destructive" onClick={handleRevert} className="gap-2">
                                <RotateCcw className="size-4" />
                                {isReverted ? "Reverted!" : "Reset to Defaults"}
                            </Button>
                            <Button variant="outline" asChild className="ml-auto">
                                <Link href="/" className="flex items-center gap-2">
                                    <ArrowLeft className="size-4" />
                                    Back to Game Stats
                                </Link>
                            </Button>
                        </div>

                        {/* Revert Notification */}
                        {isReverted && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                <RotateCcw className="size-4" />
                                <span>All perks have been reset to default values.</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Success Popup */}
                {isSaved && (
                    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-500 text-white shadow-lg">
                            <div className="flex items-center justify-center size-6 rounded-full bg-white/20">
                                <Check className="size-4" />
                            </div>
                            <div className="text-sm font-medium">
                                Perks saved successfully!
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm.show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
                        <div className="bg-background border rounded-lg shadow-lg p-6 max-w-sm mx-4 animate-in zoom-in-95 duration-200">
                            <h3 className="text-lg font-semibold mb-2">Delete Perk?</h3>
                            <p className="text-muted-foreground text-sm mb-4">
                                Are you sure you want to delete this perk? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button variant="outline" onClick={cancelDelete}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={confirmDelete}>
                                    <Trash2 className="size-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
