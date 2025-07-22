/*
 * Provide a messaging api equivalent to what is supplied by Thunderbird when running as an extension
 */
import type { Email, MessagePayload } from "../../interface/src/types/types";

export type Message = MessagePayload & { direction: "tochild" | "fromchild" };

type MessageChildPayload = Pick<MessagePayload, "type" | "id" | "data">;

export type IframeService = {
    iframe: HTMLIFrameElement | null;
    log: (message: Message) => void;
    init: (iframe: HTMLIFrameElement) => void;
    onmessage: (e: MessageEvent<MessagePayload>) => Promise<void>;
    initChild: () => void;
    messageChild: (payload: MessageChildPayload) => void;
    commands: {
        sendEmail: (_email: Email) => Promise<void>;
    };
};

export const iframeService: IframeService = {
    iframe: null,
    log: function log(message: unknown) {
        console.log(message);
    },
    init: function init(iframe: HTMLIFrameElement) {
        // Find our child iframe and send it a message as soon as possible so it is capable of sending messages back.
        iframeService.iframe = iframe || window.document.querySelector<HTMLIFrameElement>("#content-frame");
        window.childFrame = iframe;

        if (iframe.contentDocument?.readyState === "complete") {
            iframeService.initChild();
        } else {
            iframeService.iframe.onload = () => {
                iframeService.initChild();
            };
        }
    },
    onmessage: async function (e: MessageEvent<MessagePayload>) {
        const payload = e.data || {};
        const { type, id, source, data } = payload;

        if (!data) {
            return;
        }

        if (source !== "CHILD") {
            // We got a message that wasn't from our child iframe, it should be handled by a different event listener.
            return;
        }

        iframeService.log({ ...payload, direction: "fromchild" });

        switch (type) {
            case "ECHO":
                iframeService.messageChild(payload);
                break;
            case "SEND_EMAIL":
                if (data.email) {
                    await iframeService.commands.sendEmail(data.email);
                }
                iframeService.messageChild({ type, id });
                break;
            default:
                console.warn("Unknown message type", type);
        }
    },
    // Send a message to the child iframe so that it has a reference to us, it's parent.
    initChild: function initChild() {
        iframeService.iframe?.contentWindow?.addEventListener("message", iframeService.onmessage);

        const payload: MessagePayload = { type: "INITIALIZE_PARENT" };
        iframeService.iframe?.contentWindow?.postMessage(payload, "*");
        iframeService.log({ ...payload, direction: "tochild" });
    },
    // Send a message to the child iframe
    messageChild: function messageChild(payload: MessageChildPayload) {
        const { type, id, data } = payload;
        const message: MessagePayload = {
            type: type,
            source: "PARENT",
            reply_id: id,
            data: { ...data },
        };
        iframeService.iframe?.contentWindow?.postMessage(message, "*");
        iframeService.log({ ...message, direction: "tochild" });
    },
    commands: {
        sendEmail: async (_email: Email) => {
            console.warn("Function not implemented");
        },
    },
};

window.iframeService = iframeService;
