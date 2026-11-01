import { useSyncExternalStore } from "react"

// A value persisted in localStorage that React components can subscribe to.
// Changes show up immediately in every component (and every open tab), and
// the server render uses the fallback so pages can still be prerendered.
export interface Store<T> {
    fallback: T
    get(): T
    set(value: T): void
    reset(): void
    subscribe(onChange: () => void): () => void
}

interface StoreOptions<T> {
    key: string
    fallback: T
    // Turn whatever JSON is in storage (possibly from an older version of the
    // app) into a valid value. Throwing falls back to the default.
    parse: (raw: unknown) => T
    serialize?: (value: T) => unknown
}

export function createStore<T>({ key, fallback, parse, serialize = (v) => v }: StoreOptions<T>): Store<T> {
    const listeners = new Set<() => void>()
    let cachedRaw: string | null = null
    let cached = fallback

    const notify = () => listeners.forEach((l) => l())

    const write = (raw: string | null) => {
        try {
            if (raw === null) localStorage.removeItem(key)
            else localStorage.setItem(key, raw)
        } catch (error) {
            console.error(`Could not save ${key}:`, error)
        }
        notify()
    }

    return {
        fallback,
        get() {
            if (typeof window === "undefined") return fallback
            let raw: string | null = null
            try {
                raw = localStorage.getItem(key)
            } catch {
                // Storage can be unavailable (e.g. some private browsing modes).
            }
            if (raw !== cachedRaw) {
                cachedRaw = raw
                try {
                    cached = raw === null ? fallback : parse(JSON.parse(raw))
                } catch {
                    cached = fallback
                }
            }
            return cached
        },
        set(value) {
            const raw = JSON.stringify(serialize(value))
            cachedRaw = raw
            cached = value
            write(raw)
        },
        reset() {
            write(null)
        },
        subscribe(onChange) {
            listeners.add(onChange)
            const onStorage = (e: StorageEvent) => {
                if (e.key === key || e.key === null) onChange()
            }
            window.addEventListener("storage", onStorage)
            return () => {
                listeners.delete(onChange)
                window.removeEventListener("storage", onStorage)
            }
        },
    }
}

export function useStore<T>(store: Store<T>): T {
    return useSyncExternalStore(store.subscribe, store.get, () => store.fallback)
}

// True once the component is running in the browser, i.e. after hydration.
// Use it to hold back UI that would flash the fallback value first.
export function useHydrated(): boolean {
    return useSyncExternalStore(noopSubscribe, () => true, () => false)
}

const noopSubscribe = () => () => {}
