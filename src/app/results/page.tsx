import type { Metadata } from "next"
import { Suspense } from "react"
import { GameResults } from "@/components/game/game-results"

export const metadata: Metadata = { title: "Game result" }

export default function ResultsPage() {
    return (
        <Suspense>
            <GameResults />
        </Suspense>
    )
}
