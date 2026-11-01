"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const NAV = [
    { href: "/", label: "Game", match: ["/", "/spin", "/results"], tour: "nav-game" },
    { href: "/customize", label: "Point rules", match: ["/customize"], tour: "nav-rules" },
    { href: "/perks", label: "Perks", match: ["/perks"], tour: "nav-perks" },
]

export function SiteHeader() {
    const pathname = usePathname()

    return (
        <header className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-5 pt-6 sm:px-6 sm:pt-10">
            <Link href="/" className="text-sm whitespace-nowrap text-foreground">
                Progression<span className="hidden sm:inline"> Calculator</span>
            </Link>
            <nav className="-mr-2.5 flex items-center text-sm">
                {NAV.map(({ href, label, match, tour }) => {
                    const active = match.includes(pathname)
                    return (
                        <Link
                            key={href}
                            href={href}
                            data-tour={tour}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                "rounded-lg px-2.5 py-1.5 whitespace-nowrap text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground",
                                active && "text-foreground",
                            )}
                        >
                            {label}
                        </Link>
                    )
                })}
            </nav>
        </header>
    )
}
