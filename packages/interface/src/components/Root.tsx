import { StoreProvider, createStore } from "easy-peasy";
import { DarkLightThemeProvider, GlobalStyle, ThemePreference } from "radzion-ui";
import { model } from "../model";
import { PersistentStateKey, usePersistentState } from "../state/persistentState";
import App from "./app";

const store = createStore(model, { disableImmer: true });

export function Root() {
    const [theme, setTheme] = usePersistentState<ThemePreference>(PersistentStateKey.ThemePreference, "system");
    return (
        <StoreProvider store={store}>
            <DarkLightThemeProvider value={theme} onChange={setTheme}>
                <GlobalStyle fontFamily={"Tahoma, sans-serif"} />
                <App />
            </DarkLightThemeProvider>
        </StoreProvider>
    );
}
