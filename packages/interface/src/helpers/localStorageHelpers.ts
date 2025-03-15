export function removeLocalStorageItem(key: string): void {
    if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
    } else {
        console.error("removeLocalStorageItem -> window object is undefined!");
    }
}
