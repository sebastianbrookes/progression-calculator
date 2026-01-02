// Perks storage utilities for localStorage persistence

import { Perk, PERKS } from "./perks"

const STORAGE_KEY = "nba2k_custom_perks"

export function getCustomPerks(): Perk[] {
    if (typeof window === "undefined") {
        return PERKS
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            const customPerks = JSON.parse(stored) as Perk[]
            // Validate that each perk has required fields
            if (Array.isArray(customPerks) && customPerks.length > 0) {
                return customPerks
            }
        }
    } catch (error) {
        console.error("Error reading custom perks:", error)
    }

    return PERKS
}

export function saveCustomPerks(perks: Perk[]): void {
    if (typeof window === "undefined") return

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(perks))
    } catch (error) {
        console.error("Error saving custom perks:", error)
    }
}

export function resetCustomPerks(): void {
    if (typeof window === "undefined") return

    try {
        localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
        console.error("Error resetting custom perks:", error)
    }
}

export function hasCustomPerks(): boolean {
    if (typeof window === "undefined") return false

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored !== null
    } catch {
        return false
    }
}

// Helper to get a random perk using custom perks if available
export function getRandomPerkFromStorage(): Perk {
    const perks = getCustomPerks()

    // 75% chance of no perk (using 0.3 threshold for "no effect")
    if (Math.random() < 0.3) {
        return perks.find(p => p.id === "no_effect") || perks[perks.length - 1]
    }

    // 25% chance of getting an actual perk (excluding spin_wheel and no_effect)
    const actualPerks = perks.filter(p => p.id !== "spin_wheel" && p.id !== "no_effect")
    if (actualPerks.length === 0) {
        return perks.find(p => p.id === "no_effect") || perks[0]
    }
    const randomIndex = Math.floor(Math.random() * actualPerks.length)
    return actualPerks[randomIndex]
}
