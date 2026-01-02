export interface Perk {
    id: string
    name: string
    effect: string
    desc: string
    duration: string
    type: "buff" | "nerf" | "neutral" | ""
    icon: string
}

export const PERKS: Perk[] = [
    {
        id: "spin_wheel",
        name: "Spin the Wheel",
        effect: "",
        desc: "",
        duration: "",
        type: "neutral",
        icon: ""
    },

    // Buffs
    {
        id: "mamba_mentality",
        name: "Mamba Mentality",
        effect: "+5 Mid-Range Rating",
        desc: "",
        duration: "10 games",
        type: "buff",
        icon: "🐍"
    },
    {
        id: "growth_spurt",
        name: "Growth Spurt",
        effect: "+1 inch to height",
        desc: "Player must be 21 or younger",
        duration: "",
        type: "buff",
        icon: "📏"
    },
    {
        id: "linsanity",
        name: "Linsanity Run",
        effect: "+5 to ALL attributes",
        desc: "",
        duration: "10 games",
        type: "buff",
        icon: "🔥"
    },
    {
        id: "splash_zone",
        name: "Splash Zone",
        effect: "+5 3PT Rating",
        desc: "",
        duration: "8 games",
        type: "buff",
        icon: "💦"
    },
    {
        id: "point_god",
        name: "Point God",
        effect: "+4 Pass Vision & Accuracy",
        desc: "",
        duration: "12 games",
        type: "buff",
        icon: "🎯"
    },
    {
        id: "lockdown",
        name: "Lockdown",
        effect: "+4 Perimeter Defense",
        desc: "",
        duration: "10 games",
        type: "buff",
        icon: "🔒"
    },
    {
        id: "glass_cleaner",
        name: "Glass Cleaner",
        effect: "+5 Rebounding",
        desc: "",
        duration: "8 games",
        type: "buff",
        icon: "🪟"
    },
    {
        id: "poster_child",
        name: "Poster Child",
        effect: "+4 Driving Dunk",
        desc: "",
        duration: "10 games",
        type: "buff",
        icon: "🖼️"
    },
    {
        id: "ice_in_veins",
        name: "Ice In Veins",
        effect: "+3 Free Throw",
        desc: "",
        duration: "15 games",
        type: "buff",
        icon: "🧊"
    },
    {
        id: "floor_general",
        name: "Floor General",
        effect: "+3 Ball Handle",
        desc: "",
        duration: "12 games",
        type: "buff",
        icon: "🎖️"
    },
    {
        id: "rim_protector",
        name: "Rim Protector",
        effect: "+5 Block Rating",
        desc: "",
        duration: "8 games",
        type: "buff",
        icon: "🚫"
    },
    {
        id: "dawg_in_him",
        name: "Dawg In Him",
        effect: "+3 All Defense",
        desc: "",
        duration: "6 games",
        type: "buff",
        icon: "🐕"
    },
    {
        id: "green_light",
        name: "Green Light",
        effect: "+10 Shot Tendency",
        desc: "",
        duration: "10 games",
        type: "buff",
        icon: "🟢"
    },
    {
        id: "and_one",
        name: "Superstar Whistle",
        effect: "+5 Draw Foul",
        desc: "",
        duration: "12 games",
        type: "buff",
        icon: "🌟"
    },
    // Nerfs
    {
        id: "load_management",
        name: "Load Management",
        effect: "-2 Stamina",
        desc: "",
        duration: "5 games",
        type: "nerf",
        icon: "😴"
    },
    {
        id: "sophomore_slump",
        name: "Sophomore Slump",
        effect: "-3 to all attributes",
        desc: "Only applies if player is in sophomore season",
        duration: "Rest of season",
        type: "nerf",
        icon: "📉"
    },
    {
        id: "cold_streak",
        name: "Cold Streak",
        effect: "-4 3PT Rating",
        desc: "",
        duration: "4 games",
        type: "nerf",
        icon: "🥶"
    },
    {
        id: "off_night",
        name: "Off Night",
        effect: "-3 Finishing",
        desc: "",
        duration: "5 games",
        type: "nerf",
        icon: "😔"
    },
    {
        id: "heavy_legs",
        name: "Heavy Legs",
        effect: "-3 Speed",
        desc: "",
        duration: "6 games",
        type: "nerf",
        icon: "🦵"
    },
    // Neutral
    {
        id: "no_effect",
        name: "No Effect",
        effect: "Player's attributes remain unaffected",
        desc: "",
        duration: "",
        type: "neutral",
        icon: "😐"
    }
]

export function getRandomPerk(): Perk {
    // 75% chance of no perk
    if (Math.random() < 0.3) {
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
