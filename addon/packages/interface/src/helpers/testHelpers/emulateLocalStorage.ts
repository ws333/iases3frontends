/**
 * Emulate realistic localStorage behaviour
 */
export function emulateLocalStorage() {
    const localStorageMock: Record<string, string> = {};
    Object.defineProperty(globalThis, "localStorage", {
        value: {
            getItem: (key: string) => localStorageMock[key] ?? null,
            setItem: (key: string, value: string) => {
                localStorageMock[key] = value;
            },
            removeItem: (key: string) => {
                delete localStorageMock[key];
            },
            clear: () => {
                Object.keys(localStorageMock).forEach((k) => delete localStorageMock[k]);
            },
        },
        writable: true,
    });
}
