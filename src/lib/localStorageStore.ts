// A tiny external store backed by localStorage, designed to be read via
// React's useSyncExternalStore — this avoids hydration mismatches (the
// server snapshot is always the given default) and avoids calling setState
// synchronously inside an effect just to hydrate from a browser-only API.
export interface LocalStorageStore<T> {
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  subscribe: (listener: () => void) => () => void;
  set: (updater: T | ((prev: T) => T)) => void;
}

export function createLocalStorageStore<T>(
  key: string,
  initial: T
): LocalStorageStore<T> {
  let current: T = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();

  function readFromStorage(): T {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  }

  function ensureHydrated() {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    current = readFromStorage();
  }

  function getSnapshot(): T {
    ensureHydrated();
    return current;
  }

  function getServerSnapshot(): T {
    return initial;
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function set(updater: T | ((prev: T) => T)) {
    ensureHydrated();
    const next =
      typeof updater === "function"
        ? (updater as (prev: T) => T)(current)
        : updater;
    current = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(current));
    } catch {
      // ignore storage errors (private browsing, quota, etc.)
    }
    listeners.forEach((listener) => listener());
  }

  return { getSnapshot, getServerSnapshot, subscribe, set };
}
