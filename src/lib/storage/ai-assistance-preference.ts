"use client";

import { useSyncExternalStore } from "react";

export const AI_ASSISTANCE_STORAGE_KEY = "income-tax-prototype-ai-assistance";

type PreferenceStorage = Pick<Storage, "getItem" | "setItem">;
type StoreListener = () => void;

export function readAIAssistancePreference(storage: Pick<PreferenceStorage, "getItem">) {
  return storage.getItem(AI_ASSISTANCE_STORAGE_KEY) === "true";
}

export function writeAIAssistancePreference(
  storage: Pick<PreferenceStorage, "setItem">,
  value: boolean,
) {
  storage.setItem(AI_ASSISTANCE_STORAGE_KEY, String(value));
}

export function createAIAssistancePreferenceStore() {
  let value = false;
  const listeners = new Set<StoreListener>();

  function update(nextValue: boolean) {
    if (value === nextValue) return;
    value = nextValue;
    listeners.forEach((listener) => listener());
  }

  return {
    getSnapshot: () => value,
    getServerSnapshot: () => false,
    subscribe(listener: StoreListener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    hydrate(storage: Pick<PreferenceStorage, "getItem">) {
      update(readAIAssistancePreference(storage));
    },
    set(storage: Pick<PreferenceStorage, "setItem">, nextValue: boolean) {
      writeAIAssistancePreference(storage, nextValue);
      update(nextValue);
    },
  };
}

const preferenceStore = createAIAssistancePreferenceStore();
let hydrationScheduled = false;

function subscribeToBrowserPreference(onStoreChange: StoreListener) {
  const unsubscribe = preferenceStore.subscribe(onStoreChange);

  function syncFromStorage() {
    preferenceStore.hydrate(window.localStorage);
  }

  window.addEventListener("storage", syncFromStorage);

  if (!hydrationScheduled) {
    hydrationScheduled = true;
    window.setTimeout(syncFromStorage, 0);
  }

  return () => {
    unsubscribe();
    window.removeEventListener("storage", syncFromStorage);
  };
}

export function setAIAssistanceEnabled(value: boolean) {
  preferenceStore.set(window.localStorage, value);
}

export function useAIAssistancePreference() {
  return useSyncExternalStore(
    subscribeToBrowserPreference,
    preferenceStore.getSnapshot,
    preferenceStore.getServerSnapshot,
  );
}
