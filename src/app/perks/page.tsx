import type { Metadata } from "next"
import { PerkEditor } from "@/components/perks/perk-editor"

export const metadata: Metadata = { title: "Perks" }

export default function PerksPage() {
    return <PerkEditor />
}
