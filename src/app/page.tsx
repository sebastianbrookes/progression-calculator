import { Suspense } from "react"
import { GameForm, GameFormFromUrl } from "@/components/game/game-form"

export default function HomePage() {
    return (
        <>
            <div className="mb-10">
                <h1 className="text-xl text-foreground">Log a game</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Enter your player&apos;s box score and any awards, then spin for a perk.
                </p>
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
                    Feedback or ideas? Message me on <ExternalLink href="https://x.com/sbrookesss">X</ExternalLink>.
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
