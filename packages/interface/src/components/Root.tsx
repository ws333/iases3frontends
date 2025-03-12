import { createStore, StoreProvider } from "easy-peasy";

import App from "./app";
import { model } from "../model";

import "../css/browser-style.css";
import "../css/email-preview.css";

const store = createStore(model, { disableImmer: true });

export function Root() {
    return (
        <StoreProvider store={store}>
            <App />
        </StoreProvider>
    );
}
