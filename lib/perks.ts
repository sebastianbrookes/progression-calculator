export interface Perk {
    id: string
    name: string
    effect: string
    duration: number
    type: "buff" | "nerf" | "neutral"
    icon: string
}

export const PERKS: Perk[] = [
    {
        id: "spin_wheel",
        name: "Spin the Wheel",
        effect: "",
        duration: 0,
        type: "neutral",
        icon: ""
    },

    // Buffs
    {
        id: "mamba_mentality",
        name: "Mamba Mentality",
        effect: "+5 Mid-Range Rating",
        duration: 10,
        type: "buff",
        icon: "🐍"
    },
    {
        id: "splash_zone",
        name: "Splash Zone",
        effect: "+5 3PT Rating",
        duration: 8,
        type: "buff",
        icon: "💦"
    },
    {
        id: "point_god",
        name: "Point God Mode",
        effect: "+4 Pass Vision & Accuracy",
        duration: 12,
        type: "buff",
        icon: "🎯"
    },
    {
        id: "lockdown",
        name: "Lockdown",
        effect: "+4 Perimeter Defense",
        duration: 10,
        type: "buff",
        icon: "🔒"
    },
    {
        id: "glass_cleaner",
        name: "Glass Cleaner",
        effect: "+5 Rebounding",
        duration: 8,
        type: "buff",
        icon: "🪟"
    },
    {
        id: "poster_child",
        name: "Poster Child",
        effect: "+4 Driving Dunk",
        duration: 10,
        type: "buff",
        icon: "🖼️"
    },
    {
        id: "ice_in_veins",
        name: "Ice In Veins",
        effect: "+3 Free Throw",
        duration: 15,
        type: "buff",
        icon: "🧊"
    },
    {
        id: "floor_general",
        name: "Floor General",
        effect: "+3 Ball Handle",
        duration: 12,
        type: "buff",
        icon: "🎖️"
    },
    {
        id: "rim_protector",
        name: "Rim Protector",
        effect: "+5 Block Rating",
        duration: 8,
        type: "buff",
        icon: "🚫"
    },
    {
        id: "dawg_in_him",
        name: "Dawg In Him",
        effect: "+3 All Defense",
        duration: 6,
        type: "buff",
        icon: "🐕"
    },
    {
        id: "green_light",
        name: "Green Light",
        effect: "+10 Shot Tendency",
        duration: 10,
        type: "buff",
        icon: "🟢"
    },
    {
        id: "and_one",
        name: "And One",
        effect: "+3 Draw Foul",
        duration: 12,
        type: "buff",
        icon: "☝️"
    },
    // Nerfs
    {
        id: "load_management",
        name: "Load Management",
        effect: "-2 Stamina",
        duration: 5,
        type: "nerf",
        icon: "😴"
    },
    {
        id: "cold_streak",
        name: "Cold Streak",
        effect: "-4 3PT Rating",
        duration: 4,
        type: "nerf",
        icon: "🥶"
    },
    {
        id: "off_night",
        name: "Off Night",
        effect: "-3 Finishing",
        duration: 5,
        type: "nerf",
        icon: "😔"
    },
    {
        id: "heavy_legs",
        name: "Heavy Legs",
        effect: "-3 Speed",
        duration: 6,
        type: "nerf",
        icon: "🦵"
    },
    // Neutral
    {
        id: "no_effect",
        name: "No Effect",
        effect: "Player's attributes remain uneffected",
        duration: 0,
        type: "neutral",
        icon: "😐"
    }
]

export function getRandomPerk(): Perk {
    // 75% chance of no perk
    if (Math.random() < 0.5) {
        return PERKS.find(p => p.id === "no_effect")!
    }

    // 25% chance of getting an actual perk (excluding spin_wheel and no_effect)
    const actualPerks = PERKS.filter(p => p.id !== "spin_wheel" && p.id !== "no_effect")
    const randomIndex = Math.floor(Math.random() * actualPerks.length)
    return actualPerks[randomIndex]
}

export function getPerkById(id: string): Perk | undefined {
    return PERKS.find(p => p.id === id)
}
