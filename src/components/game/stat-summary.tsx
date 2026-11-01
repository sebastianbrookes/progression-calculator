import { STATS, type StatLine } from "@/lib/rules"
import { cn } from "@/lib/utils"

// One-line box score, e.g. 34 PTS  11 REB  4 AST  2 STL  1 BLK
export function StatSummary({ stats, className }: { stats: StatLine; className?: string }) {
    return (
        <dl className={cn("flex flex-wrap gap-x-4 gap-y-1 text-sm", className)}>
            {STATS.map(({ key, abbr, label }) => (
                <div key={key} className="flex items-baseline gap-1" title={label}>
                    <dd className="text-foreground tabular-nums">{stats[key]}</dd>
                    <dt className="text-xs text-muted-foreground">{abbr}</dt>
                </div>
            ))}
        </dl>
    )
}
