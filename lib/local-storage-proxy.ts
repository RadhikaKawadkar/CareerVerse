"use client";

// Helper to check if a key should be user-scoped
export const isScopedKey = (key: string): boolean => {
  if (!key) return false;
  if (key === "careerverse-active-user-id") return false;
  if (key === "careerverse-mock-session") return false;
  if (key.startsWith("sb-")) return false; // Supabase auth keys
  return (
    key.startsWith("careerverse-") ||
    key.startsWith("simulation-") ||
    key.startsWith("explored-") ||
    key.startsWith("exploration-") ||
    key.startsWith("notify-") ||
    key.startsWith("checklist-") ||
    key.startsWith("applied-") ||
    key === "explored-careers" ||
    key === "exploration-streak"
  );
};

declare global {
  interface Window {
    __careerverseLocalStorageProxyInstalled?: boolean;
  }
}

// Initialize localStorage proxy
if (typeof window !== "undefined" && !window.__careerverseLocalStorageProxyInstalled) {
  window.__careerverseLocalStorageProxyInstalled = true;

  // Store original native methods/getters before patching
  const originalGetItem = Storage.prototype.getItem;
  const originalSetItem = Storage.prototype.setItem;
  const originalRemoveItem = Storage.prototype.removeItem;
  const originalClear = Storage.prototype.clear;
  const originalKey = Storage.prototype.key;
  const originalLengthGetter = Object.getOwnPropertyDescriptor(Storage.prototype, "length")?.get;

  // Reference originalClear to satisfy typescript-eslint unused variable check
  void originalClear;

  const getPrefix = (): string => {
    const activeUserId = originalGetItem.call(localStorage, "careerverse-active-user-id");
    return activeUserId ? `user-${activeUserId}-` : "guest-";
  };

  const getPhysicalKey = (virtualKey: string): string => {
    if (!isScopedKey(virtualKey)) return virtualKey;
    return getPrefix() + virtualKey;
  };

  // Virtualized localStorage methods
  localStorage.getItem = function (key: string): string | null {
    return originalGetItem.call(localStorage, getPhysicalKey(key));
  };

  localStorage.setItem = function (key: string, value: string): void {
    originalSetItem.call(localStorage, getPhysicalKey(key), value);
  };

  localStorage.removeItem = function (key: string): void {
    originalRemoveItem.call(localStorage, getPhysicalKey(key));
  };

  // Recursion guard
  let isComputingVirtualKeys = false;

  const getVirtualKeys = (): string[] => {
    if (isComputingVirtualKeys) {
      return [];
    }
    isComputingVirtualKeys = true;
    try {
      const prefix = getPrefix();
      const keys: string[] = [];
      const length = originalLengthGetter ? originalLengthGetter.call(localStorage) : 0;
      for (let i = 0; i < length; i++) {
        const physicalKey = originalKey.call(localStorage, i);
        if (physicalKey) {
          if (!isScopedKey(physicalKey)) {
            keys.push(physicalKey);
          } else if (physicalKey.startsWith(prefix)) {
            keys.push(physicalKey.substring(prefix.length));
          }
        }
      }
      return keys;
    } finally {
      isComputingVirtualKeys = false;
    }
  };

  localStorage.key = function (index: number): string | null {
    if (isComputingVirtualKeys) {
      return originalKey.call(localStorage, index);
    }
    const keys = getVirtualKeys();
    return keys[index] ?? null;
  };

  Object.defineProperty(localStorage, "length", {
    get: function (): number {
      if (isComputingVirtualKeys) {
        return originalLengthGetter ? originalLengthGetter.call(localStorage) : 0;
      }
      return getVirtualKeys().length;
    },
    configurable: true,
  });

  localStorage.clear = function (): void {
    const prefix = getPrefix();
    const keysToRemove: string[] = [];
    const length = originalLengthGetter ? originalLengthGetter.call(localStorage) : 0;
    for (let i = 0; i < length; i++) {
      const physicalKey = originalKey.call(localStorage, i);
      if (physicalKey && (physicalKey.startsWith(prefix) || isScopedKey(physicalKey))) {
        keysToRemove.push(physicalKey);
      }
    }
    keysToRemove.forEach((k) => originalRemoveItem.call(localStorage, k));
  };
}

/**
 * Migrates all guest-scoped keys in localStorage to user-scoped keys
 */
export function migrateGuestToUserKeys(userId: string): void {
  if (typeof window === "undefined") return;
  const originalGetItem = Storage.prototype.getItem;
  const originalSetItem = Storage.prototype.setItem;
  const originalRemoveItem = Storage.prototype.removeItem;
  const originalKey = Storage.prototype.key;
  const originalLengthGetter = Object.getOwnPropertyDescriptor(Storage.prototype, "length")?.get;

  const migrationDoneKey = `careerverse-guest-migrated-to-${userId}`;
  if (originalGetItem.call(localStorage, migrationDoneKey) === "true") return;

  console.log(`Migrating guest data to user keys for user: ${userId}`);

  const keysToCopy: { guestKey: string; userKey: string }[] = [];
  const length = originalLengthGetter ? originalLengthGetter.call(localStorage) : 0;
  for (let i = 0; i < length; i++) {
    const physicalKey = originalKey.call(localStorage, i);
    if (physicalKey && physicalKey.startsWith("guest-")) {
      const userKey = physicalKey.replace("guest-", `user-${userId}-`);
      keysToCopy.push({ guestKey: physicalKey, userKey });
    }
  }

  keysToCopy.forEach(({ guestKey, userKey }) => {
    const value = originalGetItem.call(localStorage, guestKey);
    if (value !== null) {
      originalSetItem.call(localStorage, userKey, value);
    }
  });

  // Clear guest keys to ensure fresh guest experience on logout
  keysToCopy.forEach(({ guestKey }) => {
    originalRemoveItem.call(localStorage, guestKey);
  });

  originalSetItem.call(localStorage, migrationDoneKey, "true");
}

/**
 * Resets local guest data (stale local demo data)
 */
export function clearGuestData(): void {
  if (typeof window === "undefined") return;
  const originalRemoveItem = Storage.prototype.removeItem;
  const originalKey = Storage.prototype.key;
  const originalLengthGetter = Object.getOwnPropertyDescriptor(Storage.prototype, "length")?.get;

  const keysToRemove: string[] = [];
  const length = originalLengthGetter ? originalLengthGetter.call(localStorage) : 0;
  for (let i = 0; i < length; i++) {
    const physicalKey = originalKey.call(localStorage, i);
    if (physicalKey && physicalKey.startsWith("guest-")) {
      keysToRemove.push(physicalKey);
    }
  }

  keysToRemove.forEach((k) => originalRemoveItem.call(localStorage, k));
  console.log("Guest local demo data cleared.");
}
