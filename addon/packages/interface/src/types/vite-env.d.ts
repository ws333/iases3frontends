/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_FEATURE_EU_INCLUDES_EFTA: string;
    readonly VITE_FEATURE_EU_INCLUDES_CANDIDATES: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
