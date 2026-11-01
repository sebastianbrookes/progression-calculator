"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const NAV = [
    { href: "/", label: "Game", match: ["/", "/spin", "/results"] },
    { href: "/customize", label: "Point rules", match: ["/customize"] },
    { href: "/perks", label: "Perks", match: ["/perks"] },
]

export function SiteHeader() {
    const pathname = usePathname()

    return (
        <header className="border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70 sticky top-0 z-40">
            <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
                <Link href="/" className="font-display text-xl font-extrabold tracking-wide uppercase">
                    Progression
                </Link>
                <nav className="-mr-2 flex items-center">
                    {NAV.map(({ href, label, match }) => {
                        const active = match.includes(pathname)
                        return (
                            <Link
                                key={href}
                                href={href}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "relative px-2.5 py-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:px-3",
                                    active && "text-foreground after:absolute after:inset-x-2.5 after:-bottom-px after:h-0.5 after:bg-primary sm:after:inset-x-3",
                                )}
                            >
                                {label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </header>
    )
}
