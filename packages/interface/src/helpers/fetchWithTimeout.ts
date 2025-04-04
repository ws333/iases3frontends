import { defaultFetchTimeout } from "../constants/constants";

export async function fetchWithTimeout(url: string | URL, error: Error) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(error), defaultFetchTimeout);

    const response = await fetch(url, {
        signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return response;
}
