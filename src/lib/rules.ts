// The point system: every rule that can earn attribute or badge points, and
// the default value for each. The calculator, the settings page, and the
// stats form all read from here, so a new rule only needs to be added once.

export const STATS = [
    { key: "points", label: "Points", abbr: "PTS" },
    { key: "rebounds", label: "Rebounds", abbr: "REB" },
    { key: "assists", label: "Assists", abbr: "AST" },
    { key: "steals", label: "Steals", abbr: "STL" },
    { key: "blocks", label: "Blocks", abbr: "BLK" },
] as const

export type StatKey = (typeof STATS)[number]["key"]
export type StatLine = Record<StatKey, number>

// Setting keys are persisted in localStorage, so renaming one drops the
// user's saved value for it.
export const DEFAULT_SETTINGS = {
    points_70: 20,
    points_60: 15,
    points_50: 10,
    points_40: 5,
    points_30: 3,
    points_20: 2,
    points_10: 1,

    rebounds_20: 3,
    rebounds_10: 1,

    assists_20: 3,
    assists_10: 1,

    steals_10: 5,
    steals_6: 3,
    steals_3: 1,

    blocks_10: 5,
    blocks_6: 3,
    blocks_3: 1,

    double_double_2: 3,
    double_double_3: 5,
    double_double_4: 15,
    double_double_5: 30,

    player_of_the_game: 1,
    player_of_the_week: 3,
    player_of_the_month: 5,
    rookie_of_the_month: 3,

    roty_points: 7,
    dpoy_points: 5,
    mvp_points: 15,
    champion_points: 10,

    roty_badge: 3,
    dpoy_badge: 3,
    mvp_badge: 3,
    champion_badge: 2,
} satisfies Record<string, number>

export type SettingKey = keyof typeof DEFAULT_SETTINGS
export type PointSettings = Record<SettingKey, number>

export interface Tier {
    min: number
    setting: SettingKey
}

// Only the highest tier reached pays out. Tiers are listed highest first.
export const STAT_TIERS: Record<StatKey, Tier[]> = {
    points: [70, 60, 50, 40, 30, 20, 10].map((min) => ({ min, setting: `points_${min}` as SettingKey })),
    rebounds: [20, 10].map((min) => ({ min, setting: `rebounds_${min}` as SettingKey })),
    assists: [20, 10].map((min) => ({ min, setting: `assists_${min}` as SettingKey })),
    steals: [10, 6, 3].map((min) => ({ min, setting: `steals_${min}` as SettingKey })),
    blocks: [10, 6, 3].map((min) => ({ min, setting: `blocks_${min}` as SettingKey })),
}

// Counted by how many stats reach double figures. Highest first.
export const MULTI_DOUBLES: { count: number; label: string; setting: SettingKey }[] = [
    { count: 5, label: "Quintuple-double", setting: "double_double_5" },
    { count: 4, label: "Quadruple-double", setting: "double_double_4" },
    { count: 3, label: "Triple-double", setting: "double_double_3" },
    { count: 2, label: "Double-double", setting: "double_double_2" },
]

export interface Award {
    id: string
    label: string
    short: string
    kind: "recurring" | "season"
    attr: SettingKey
    badge?: SettingKey
}

// Award ids are part of shared results URLs.
export const AWARDS: Award[] = [
    { id: "player_of_the_game", label: "Player of the Game", short: "POTG", kind: "recurring", attr: "player_of_the_game" },
    { id: "player_of_the_week", label: "Player of the Week", short: "POTW", kind: "recurring", attr: "player_of_the_week" },
    { id: "player_of_the_month", label: "Player of the Month", short: "POTM", kind: "recurring", attr: "player_of_the_month" },
    { id: "rookie_of_the_month", label: "Rookie of the Month", short: "ROTM", kind: "recurring", attr: "rookie_of_the_month" },
    { id: "roty", label: "Rookie of the Year", short: "ROTY", kind: "season", attr: "roty_points", badge: "roty_badge" },
    { id: "dpoy", label: "Defensive Player of the Year", short: "DPOY", kind: "season", attr: "dpoy_points", badge: "dpoy_badge" },
    { id: "mvp", label: "Most Valuable Player", short: "MVP", kind: "season", attr: "mvp_points", badge: "mvp_badge" },
    { id: "champion", label: "Champion", short: "Champion", kind: "season", attr: "champion_points", badge: "champion_badge" },
]

// What one +1 attribute upgrade costs at each current rating. Shown as a
// reference on the results screen.
export const UPGRADE_COSTS = [
    { range: "Below 70", cost: 1, colour: "white" },
    { range: "70–79", cost: 2, colour: "yellow" },
    { range: "80–89", cost: 3, colour: "gray" },
    { range: "90–94", cost: 5, colour: "purple" },
    { range: "95+", cost: 5, colour: "orange" },
] as const
