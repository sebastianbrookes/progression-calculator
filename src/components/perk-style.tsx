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
