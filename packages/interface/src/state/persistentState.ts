import { LocalStorage, TemporaryStorage, createPersistentStateHook, createPersistentStateManager } from "radzion-ui";

export enum PersistentStateKey {
    ThemePreference = "themePreference",
    ShowOnceEducation = "showOnceEducation",
    HabitsEducationWasAt = "habitsEducationWasAt",
}

const persistentStorage =
    typeof window !== "undefined" ? new LocalStorage<PersistentStateKey>() : new TemporaryStorage<PersistentStateKey>();

export const usePersistentState = createPersistentStateHook<PersistentStateKey>(persistentStorage);

export const managePersistentState = createPersistentStateManager<PersistentStateKey>(persistentStorage);
