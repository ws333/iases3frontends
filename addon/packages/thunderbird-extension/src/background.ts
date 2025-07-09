import { Message } from "../../iframe-service/src/iframe-service";

function log(...args: unknown[]) {
    console.log("[IASES3]:", ...args);
}

log("Extension loaded...");

class IASES3Window {
    constructor(
        private openWindowId: number = 0,
        private isReady = false,
        private _messageQueue: Message[] = []
    ) {
        // If we get a message, it means that the window has finished loading.
        // In that case, we are free to send messages to the window
        browser.runtime.onMessage.addListener(async (message) => {
            log("background.js received message", message);
            if ((message || {}).status === "loaded") {
                await this._onWindowOpened();
            }
        });
    }
    async _onWindowOpened() {
        this.isReady = true;
        const messagePromises = this._messageQueue.map((message) => this.sendMessage(message));
        this._messageQueue.length = 0;
        await Promise.all(messagePromises);
    }
    async ensureWindowOpened() {
        let ret: browser.windows.Window;
        try {
            ret = await browser.windows.get(this.openWindowId);
            await browser.windows.update(this.openWindowId, { focused: true });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // No window found, creating a new one.
            ret = await browser.windows.create({
                url: "content/thunderbird-iframe-server.html",
                type: "popup",
                allowScriptsToClose: true,
                height: 800,
                width: 800,
            });
            this.openWindowId = ret.id || 0;
        }
        return ret;
    }
    async sendMessage(message: Message) {
        // Check to see if the window is still open. If not, it is no longer ready.
        try {
            if (this.openWindowId) await browser.windows.get(this.openWindowId);
        } catch (error) {
            this.isReady = false;
            log("sendMessage -> error:", error);
        }

        // Even if the window is open, it may not be ready
        if (this.isReady) {
            browser.runtime.sendMessage(message);
        } else {
            this._messageQueue.push(message);
        }
    }
    async close() {
        try {
            if (this.openWindowId) {
                await browser.windows.get(this.openWindowId);
                await browser.windows.remove(this.openWindowId);
            }
            this.openWindowId = 0;
            this.isReady = false;
        } catch (error) {
            // Already closed
            log(error);
        }
    }
}
const iases3Window = new IASES3Window();

// Listen for when the "Step 3" button is clicked
browser.browserAction.onClicked.addListener(async () => {
    await iases3Window.ensureWindowOpened();
});

// We are responsible for closing the "Step 3" window if asked.
browser.runtime.onMessage.addListener(async (message) => {
    if ((message || {}).action === "close") {
        await iases3Window.close();
    }
});
