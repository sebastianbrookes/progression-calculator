import { Suspense } from "react"
import { GameForm, GameFormFromUrl } from "@/components/game/game-form"
import { PerksToggle } from "@/components/game/perks-toggle"
import { TourButton } from "@/components/tour"

export default function HomePage() {
    return (
        <>
            <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-xl text-foreground">Log a game</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Enter your player&apos;s box score and any awards.</p>
                </div>
                <PerksToggle className="sm:w-72" />
            </div>

            {/* The empty form is prerendered; the URL-filled one replaces it on load. */}
            <Suspense fallback={<GameForm />}>
                <GameFormFromUrl />
            </Suspense>

            <footer className="mt-20 space-y-1 text-xs leading-relaxed text-muted-foreground">
                <p>
                    Made for{" "}
                    <ExternalLink href="https://www.youtube.com/@PeeWeeDaGamer">Peeweedaplug</ExternalLink>
                    &apos;s rebuild series. Inspired by Jonas Dockx&apos;s{" "}
                    <ExternalLink href="https://www.nba2kpt.com/">nba2kpt.com</ExternalLink>.
                </p>
                <p>
                    New here?{" "}
                    <TourButton className="cursor-pointer text-secondary-foreground underline decoration-white/20 underline-offset-[3px] transition-colors hover:text-foreground hover:decoration-white/60" />
                </p>
            </footer>
        </>
    )
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-secondary-foreground underline decoration-white/20 underline-offset-[3px] transition-colors hover:text-foreground hover:decoration-white/60">
            {children}
        </a>
    )
}
