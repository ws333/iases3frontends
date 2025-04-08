import { defaultFetchTimeout } from "../constants/constants";

export async function fetchWithTimeout(url: string | URL, errorMessage: string, timeout = defaultFetchTimeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(new Error(errorMessage)), timeout);

    const response = await fetch(url, {
        signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return response;
}
