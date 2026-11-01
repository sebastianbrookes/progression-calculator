import { Clock } from "lucide-react"
import type { PerkType } from "@/lib/perks"
import { cn } from "@/lib/utils"

export const PERK_TYPE_LABEL: Record<PerkType, string> = {
    buff: "Buff",
    nerf: "Nerf",
    neutral: "Neutral",
}

const DOT: Record<PerkType, string> = {
    buff: "bg-buff",
    nerf: "bg-nerf",
    neutral: "bg-neutral",
}

export function PerkTypeDot({ type, className }: { type: PerkType; className?: string }) {
    return <span aria-hidden className={cn("inline-block size-2 shrink-0 rounded-full", DOT[type], className)} />
}

// A coloured dot followed by the type name, e.g. "● Buff".
export function PerkTypeLabel({ type, className }: { type: PerkType; className?: string }) {
    return (
        <span className={cn("inline-flex items-center gap-1.5 text-muted-foreground", className)}>
            <PerkTypeDot type={type} />
            {PERK_TYPE_LABEL[type]}
        </span>
    )
}

// How long a perk lasts. Players need this at a glance, so it's a chip in
// full-strength text rather than a muted caption.
export function PerkDuration({ duration, size = "sm", className }: { duration: string; size?: "sm" | "lg"; className?: string }) {
    return (
        <span
            className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-md bg-white/[0.07] font-normal whitespace-nowrap text-foreground ring-1 ring-white/10",
                size === "lg" ? "px-2.5 py-1 text-base [&_svg]:size-4" : "px-2 py-0.5 text-sm [&_svg]:size-3.5",
                className,
            )}
        >
            <Clock aria-hidden />
            {duration}
        </span>
    )
}
