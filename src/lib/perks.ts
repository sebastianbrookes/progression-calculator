export type PerkType = "buff" | "nerf" | "neutral"

export interface Perk {
    id: string
    name: string
    effect: string
    desc: string
    duration: string
    type: PerkType
    icon: string
}

// The "nothing happens" outcome. It can be edited but not deleted, because
// the draw falls back to it.
export const NO_EFFECT_ID = "no_effect"

// Chance that a spin lands on No Effect instead of a real perk.
export const NO_EFFECT_CHANCE = 0.3

export const DEFAULT_PERKS: Perk[] = [
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
    {
        id: "ankle_breaker",
        name: "Ankle Breaker",
        effect: "+4 Ball Handle & +2 Speed with Ball",
        desc: "Crossovers leave defenders stumbling",
        duration: "10 games",
        type: "buff",
        icon: "🦶"
    },
    {
        id: "wilts_ghost",
        name: "Wilt's Ghost",
        effect: "+6 Rebounding & +3 Vertical",
        desc: "Channeling the Big Dipper's energy",
        duration: "6 games",
        type: "buff",
        icon: "👻"
    },
    {
        id: "showtime",
        name: "Showtime",
        effect: "+4 Flashy Pass & +3 Driving Layup",
        desc: "Hollywood-level entertainment",
        duration: "10 games",
        type: "buff",
        icon: "🎬"
    },
    {
        id: "post_malone",
        name: "Post Malone",
        effect: "+5 Post Control & +3 Post Fade",
        desc: "Dominating the paint old school",
        duration: "8 games",
        type: "buff",
        icon: "📬"
    },
    {
        id: "gym_rat",
        name: "Gym Rat",
        effect: "+2 All Physicals",
        desc: "Extra offseason work pays off",
        duration: "Rest of season",
        type: "buff",
        icon: "🏋️"
    },
    {
        id: "hot_hand",
        name: "Hot Hand",
        effect: "+3 to all offensive attributes",
        desc: "Can't miss from anywhere",
        duration: "12 games",
        type: "buff",
        icon: "🤚"
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
        name: "Scared of the Rim",
        effect: "-3 Finishing",
        desc: "",
        duration: "5 games",
        type: "nerf",
        icon: "😔"
    },
    {
        id: "sprite",
        name: "Sprite on the Sideline",
        effect: "-10 Stamina",
        desc: "Player took DMills' advice :((",
        duration: "5 games",
        type: "nerf",
        icon: "🥤"
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
    {
        id: "contract_year_blues",
        name: "Contract Year Blues",
        effect: "-3 Shot IQ",
        desc: "Pressing too hard for that bag",
        duration: "8 games",
        type: "nerf",
        icon: "📝"
    },
    {
        id: "tunnel_vision",
        name: "Tunnel Vision",
        effect: "-4 Pass Vision & Accuracy",
        desc: "Forgot teammates exist",
        duration: "6 games",
        type: "nerf",
        icon: "🚇"
    },
    {
        id: "butter_fingers",
        name: "Butter Fingers",
        effect: "-3 Ball Handle & -2 Pass Accuracy",
        desc: "Can't hold onto anything",
        duration: "5 games",
        type: "nerf",
        icon: "🧈"
    },
    {
        id: "glass_ankles",
        name: "Ankle Tweak",
        effect: "-4 Speed & Acceleration",
        desc: "Nagging injury slowing you down",
        duration: "4 games",
        type: "nerf",
        icon: "🩹"
    },
    {
        id: "playoff_choker",
        name: "Playoff Choker",
        effect: "-3 All Attributes",
        desc: "Big moments, small performances",
        duration: "Playoffs only",
        type: "nerf",
        icon: "😰"
    },
    {
        id: "party_animal",
        name: "Party Animal",
        effect: "-2 Speed & -3 Stamina",
        desc: "Someone was out too late",
        duration: "5 games",
        type: "nerf",
        icon: "🎉"
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

export function drawPerk(perks: Perk[], random: () => number = Math.random): Perk {
    const noEffect = perks.find((p) => p.id === NO_EFFECT_ID) ?? DEFAULT_PERKS.find((p) => p.id === NO_EFFECT_ID)!
    const pool = perks.filter((p) => p.id !== NO_EFFECT_ID)
    if (pool.length === 0 || random() < NO_EFFECT_CHANCE) return noEffect
    return pool[Math.floor(random() * pool.length)]
}

// Durations like "0 games" or "N/A" mean the perk is permanent or instant.
export function hasDuration(perk: Perk): boolean {
    const d = perk.duration.trim().toLowerCase()
    return d !== "" && d !== "0 games" && d !== "n/a"
}
