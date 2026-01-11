"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Dices, SkipForward, ArrowRight, Sparkles, RotateCcw, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Perk, PERKS } from "@/lib/perks"
import { getCustomPerks, getRandomPerkFromStorage } from "@/lib/perksStorage"

function SpinContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isSpinning, setIsSpinning] = React.useState(false)
    const [hasSpun, setHasSpun] = React.useState(false)
    const [perks, setPerks] = React.useState<Perk[]>(PERKS)
    const [currentPerk, setCurrentPerk] = React.useState<Perk>(PERKS[0])
    const [finalPerk, setFinalPerk] = React.useState<Perk | null>(null)
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

    // Get all params to pass through
    const paramsString = searchParams.toString()

    const handleSkip = () => {
        router.push(`/results?${paramsString}`)
    }

    const handleContinue = () => {
        if (finalPerk) {
            router.push(`/results?${paramsString}&perk=${finalPerk.id}`)
        }
    }

    const handleSpinAgain = () => {
        setHasSpun(false)
        setFinalPerk(null)
        // Immediately start spinning again
        setIsSpinning(true)

        let count = 0
        const maxCount = 30 + Math.floor(Math.random() * 20)
        const selected = getRandomPerkFromStorage()

        intervalRef.current = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * perks.length)
            setCurrentPerk(perks[randomIndex])
            count++

            if (count >= maxCount) {
                if (intervalRef.current) clearInterval(intervalRef.current)
                setCurrentPerk(selected)
                setFinalPerk(selected)
                setIsSpinning(false)
                setHasSpun(true)
            }
        }, 80)
    }

    const handleSpin = () => {
        if (isSpinning || hasSpun) return

        setIsSpinning(true)

        // Cycle through perks rapidly
        let count = 0
        const maxCount = 30 + Math.floor(Math.random() * 20) // 30-50 cycles
        const selected = getRandomPerkFromStorage()

        intervalRef.current = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * perks.length)
            setCurrentPerk(perks[randomIndex])
            count++

            if (count >= maxCount) {
                if (intervalRef.current) clearInterval(intervalRef.current)
                setCurrentPerk(selected)
                setFinalPerk(selected)
                setIsSpinning(false)
                setHasSpun(true)
            }
        }, 80) // Speed of cycling
    }

    React.useEffect(() => {
        // Load custom perks from localStorage on mount
        const customPerks = getCustomPerks()
        setPerks(customPerks)
        setCurrentPerk(customPerks[0])
    }, [])

    React.useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    const getPerkColor = (type: Perk["type"]) => {
        switch (type) {
            case "buff":
                return "from-emerald-500/20 to-green-500/20 border-emerald-500/50"
            case "nerf":
                return "from-red-500/20 to-orange-500/20 border-red-500/50"
            case "neutral":
                return "from-gray-500/20 to-slate-500/20 border-gray-500/50"
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
        <div className="min-h-screen bg-background py-12 px-4 flex flex-col items-center justify-center">
            <div className="max-w-lg w-full mx-auto text-center">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-center mb-4">
                        <Dices className={`size-12 text-primary ${isSpinning ? 'animate-bounce' : ''}`} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
                        {hasSpun ? "You Got..." : "Spin for a Perk"}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        {hasSpun
                            ? "This perk will affect your player for the next few games."
                            : "Try your luck! Spin to receive a random buff or debuff."}
                    </p>
                </div>

                {/* Perk Display Card */}
                <Card className={`mb-8 bg-gradient-to-br ${getPerkColor(currentPerk.type)} border-2 transition-all duration-100 ${isSpinning ? 'scale-105' : ''} h-72 w-full`}>
                    <CardContent className="py-10 px-6 h-full flex flex-col items-center justify-center overflow-hidden">
                        <div className={`text-6xl mb-4 shrink-0 ${isSpinning ? 'animate-pulse' : ''}`}>
                            {currentPerk.icon}
                        </div>
                        <h2 className={`text-2xl font-bold mb-2 ${getPerkTextColor(currentPerk.type)} truncate max-w-full shrink-0`}>
                            {currentPerk.name}
                        </h2>
                        <p className="text-lg font-medium text-foreground mb-2 line-clamp-2 text-center shrink-0">
                            {currentPerk.effect}
                        </p>
                        {currentPerk.desc && (
                            <p className="text-sm text-muted-foreground/80 italic mb-2 line-clamp-2 text-center shrink-0">
                                {currentPerk.desc}
                            </p>
                        )}
                        <p className="text-sm text-muted-foreground shrink-0">
                            {currentPerk.duration}
                        </p>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    {!hasSpun ? (
                        <>
                            <Button
                                size="lg"
                                className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                                onClick={handleSpin}
                                disabled={isSpinning}
                            >
                                {isSpinning ? (
                                    <>
                                        <Sparkles className="size-5 mr-2 animate-spin" />
                                        Spinning...
                                    </>
                                ) : (
                                    <>
                                        <Dices className="size-5 mr-2" />
                                        SPIN THE WHEEL
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full"
                                onClick={handleSkip}
                                disabled={isSpinning}
                            >
                                <SkipForward className="size-4 mr-2" />
                                Skip to Results
                            </Button>
                            <Button
                                variant="ghost"
                                size="lg"
                                className="w-full"
                                asChild
                            >
                                <Link href="/">
                                    <ArrowLeft className="size-4 mr-2" />
                                    Back to Game Stats
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                size="lg"
                                className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                                onClick={handleContinue}
                            >
                                Continue to Results
                                <ArrowRight className="size-5 ml-2" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full"
                                onClick={handleSpinAgain}
                            >
                                <RotateCcw className="size-4 mr-2" />
                                Spin Again
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function SpinPage() {
    return (
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SpinContent />
        </React.Suspense>
    )
}
