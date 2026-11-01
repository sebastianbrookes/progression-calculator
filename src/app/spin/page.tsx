import type { Metadata } from "next"
import { Suspense } from "react"
import { PerkSpin } from "@/components/game/perk-spin"

export const metadata: Metadata = { title: "Spin for a perk" }

export default function SpinPage() {
    return (
        <Suspense>
            <PerkSpin />
        </Suspense>
    )
}
