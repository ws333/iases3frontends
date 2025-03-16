import { LocalStorage } from "radzion-lib-ui/state/LocalStorage";
import { TemporaryStorage } from "radzion-lib-ui/state/TemporaryStorage";
import { createPersistentStateHook } from "radzion-lib-ui/state/createPersistentStateHook";
import { createPersistentStateManager } from "radzion-lib-ui/state/createPersistentStateManager";

export enum PersistentStateKey {
    ThemePreference = "themePreference",
    ShowOnceEducation = "showOnceEducation",
    HabitsEducationWasAt = "habitsEducationWasAt",
}

const persistentStorage =
    typeof window !== "undefined" ? new LocalStorage<PersistentStateKey>() : new TemporaryStorage<PersistentStateKey>();

export const usePersistentState = createPersistentStateHook<PersistentStateKey>(persistentStorage);

export const managePersistentState = createPersistentStateManager<PersistentStateKey>(persistentStorage);
