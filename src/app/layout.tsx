import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Big_Shoulders, Saira } from "next/font/google"
import { SiteHeader } from "@/components/site-header"
import "./globals.css"

const saira = Saira({ subsets: ["latin"], variable: "--font-saira", display: "swap" })
const bigShoulders = Big_Shoulders({ subsets: ["latin"], variable: "--font-big-shoulders", display: "swap" })

export const metadata: Metadata = {
    title: {
        default: "Progression Point Calculator",
        template: "%s | Progression Point Calculator",
    },
    description:
        "Turn an NBA 2K MyNBA box score into attribute and badge points, then spin for a random perk. Built for Peeweedaplug's rebuild series.",
}

export const viewport: Viewport = {
    themeColor: "#0c1428",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${saira.variable} ${bigShoulders.variable}`}>
            <body className="flex min-h-dvh flex-col">
                <SiteHeader />
                <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-16 sm:px-6 sm:pt-10">{children}</main>
                <Analytics />
            </body>
        </html>
    )
}
