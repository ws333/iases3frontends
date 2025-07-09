import type { IframeService } from "./iframe-service";

export {};

// Global properties referenced in packages/iframe-service/src/iframe-service.ts
declare global {
    interface Window {
        iframeService: IframeService;
        childFrame: HTMLIFrameElement;
    }
}
