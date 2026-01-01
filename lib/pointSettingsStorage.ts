// Point system settings interface and storage utilities

export interface PointSettings {
    // Scoring thresholds
    points_70: number
    points_60: number
    points_50: number
    points_40: number
    points_30: number
    points_20: number
    points_10: number

    // Rebounds thresholds
    rebounds_20: number
    rebounds_10: number

    // Assists thresholds
    assists_20: number
    assists_10: number

    // Steals thresholds
    steals_10: number
    steals_6: number
    steals_3: number

    // Blocks thresholds
    blocks_10: number
    blocks_6: number
    blocks_3: number

    // Double/Triple/Quadruple/Quintuple Double
    double_double_2: number
    double_double_3: number
    double_double_4: number
    double_double_5: number

    // Player of the Game/Week/Month
    player_of_the_game: number
    player_of_the_week: number
    player_of_the_month: number
    rookie_of_the_month: number

    // Season awards - Points
    roty_points: number
    dpoy_points: number
    mvp_points: number
    champion_points: number

    // Season awards - Badge Points
    roty_badge: number
    dpoy_badge: number
    mvp_badge: number
    champion_badge: number
}

export const DEFAULT_SETTINGS: PointSettings = {
    // Scoring thresholds
    points_70: 20,
    points_60: 15,
    points_50: 10,
    points_40: 5,
    points_30: 3,
    points_20: 2,
    points_10: 1,

    // Rebounds thresholds
    rebounds_20: 3,
    rebounds_10: 1,

    // Assists thresholds
    assists_20: 3,
    assists_10: 1,

    // Steals thresholds
    steals_10: 5,
    steals_6: 3,
    steals_3: 1,

    // Blocks thresholds
    blocks_10: 5,
    blocks_6: 3,
    blocks_3: 1,

    // Double/Triple/Quadruple/Quintuple Double
    double_double_2: 3,
    double_double_3: 5,
    double_double_4: 15,
    double_double_5: 30,

    // Player of the Game/Week/Month
    player_of_the_game: 1,
    player_of_the_week: 3,
    player_of_the_month: 5,
    rookie_of_the_month: 3,

    // Season awards - Points
    roty_points: 7,
    dpoy_points: 5,
    mvp_points: 15,
    champion_points: 10,

    // Season awards - Badge Points
    roty_badge: 3,
    dpoy_badge: 3,
    mvp_badge: 3,
    champion_badge: 2,
}

const STORAGE_KEY = "nba2k_point_settings"

export function getPointSettings(): PointSettings {
    if (typeof window === "undefined") {
        return DEFAULT_SETTINGS
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
        }
    } catch (error) {
        console.error("Error reading point settings:", error)
    }

    return DEFAULT_SETTINGS
}

export function savePointSettings(settings: PointSettings): void {
    if (typeof window === "undefined") return

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
        console.error("Error saving point settings:", error)
    }
}

export function resetPointSettings(): void {
    if (typeof window === "undefined") return

    try {
        localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
        console.error("Error resetting point settings:", error)
    }
}
