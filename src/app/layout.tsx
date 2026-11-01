import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Inter } from "next/font/google"
import { SiteHeader } from "@/components/site-header"
import { Tour } from "@/components/tour"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })

export const metadata: Metadata = {
    title: {
        default: "Progression Point Calculator",
        template: "%s | Progression Point Calculator",
    },
    description:
        "Turn an NBA 2K MyNBA box score into attribute and badge points, then spin for a random perk. Built for Peeweedaplug's rebuild series.",
}

export const viewport: Viewport = {
    themeColor: "#171717",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="min-h-dvh">
                <SiteHeader />
                <main className="mx-auto w-full max-w-4xl px-5 pt-12 pb-20 sm:px-6 sm:pt-16">{children}</main>
                <Tour />
                <Analytics />
            </body>
        </html>
    )
}
