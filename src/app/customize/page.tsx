import type { Metadata } from "next"
import { PointRulesEditor } from "@/components/settings/point-rules-editor"

export const metadata: Metadata = { title: "Point rules" }

export default function PointRulesPage() {
    return <PointRulesEditor />
}
