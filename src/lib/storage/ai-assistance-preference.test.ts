import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_ASSISTANCE_STORAGE_KEY,
  createAIAssistancePreferenceStore,
  readAIAssistancePreference,
  writeAIAssistancePreference,
} from "./ai-assistance-preference.ts";

test("AI Assistance uses one persisted boolean preference", () => {
  const values = new Map<string, string>();
  const storage = {
    getItem(key: string) { return values.get(key) ?? null; },
    setItem(key: string, value: string) { values.set(key, value); },
  };

  assert.equal(readAIAssistancePreference(storage), false);
  writeAIAssistancePreference(storage, true);
  assert.equal(values.get(AI_ASSISTANCE_STORAGE_KEY), "true");
  assert.equal(readAIAssistancePreference(storage), true);
  writeAIAssistancePreference(storage, false);
  assert.equal(readAIAssistancePreference(storage), false);
});

test("AI Assistance initialization is deterministic until storage hydrates", () => {
  const store = createAIAssistancePreferenceStore();
  const persistedOn = { getItem: () => "true" };

  assert.equal(store.getServerSnapshot(), false);
  assert.equal(store.getSnapshot(), false);

  let updates = 0;
  const unsubscribe = store.subscribe(() => { updates += 1; });
  store.hydrate(persistedOn);

  assert.equal(store.getSnapshot(), true);
  assert.equal(updates, 1);
  unsubscribe();
});

test("persisted writes and every subscriber receive the same boolean", () => {
  const store = createAIAssistancePreferenceStore();
  const values = new Map<string, string>();
  const storage = {
    getItem(key: string) { return values.get(key) ?? null; },
    setItem(key: string, value: string) { values.set(key, value); },
  };
  const snapshots: boolean[] = [];
  store.subscribe(() => snapshots.push(store.getSnapshot()));

  store.set(storage, true);
  store.set(storage, false);

  assert.deepEqual(snapshots, [true, false]);
  assert.equal(values.get(AI_ASSISTANCE_STORAGE_KEY), "false");
});
