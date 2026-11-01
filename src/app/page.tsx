import { Suspense } from "react"
import { GameForm, GameFormFromUrl } from "@/components/game/game-form"

export default function HomePage() {
    return (
        <>
            <div className="mb-8 max-w-xl">
                <h1 className="font-display text-5xl font-extrabold uppercase sm:text-6xl">Log a game</h1>
                <p className="mt-2 text-muted-foreground">
                    Enter your player&apos;s box score and any awards, then spin for a perk.
                </p>
            </div>

            {/* The empty form is prerendered; the URL-filled one replaces it on load. */}
            <Suspense fallback={<GameForm />}>
                <GameFormFromUrl />
            </Suspense>

            <footer className="mt-20 max-w-xl space-y-1.5 text-sm text-muted-foreground">
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
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-foreground underline decoration-line underline-offset-4 hover:decoration-primary">
            {children}
        </a>
    )
}
