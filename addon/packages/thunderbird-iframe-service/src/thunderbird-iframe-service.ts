/*
 * Provide a messaging api equivalent to what is supplied by Thunderbird when running as an extension
 */
import { Email } from "../../interface/src/types/modelTypes";
import { getUniqueMessageId } from "../../interface/src/helpers/getUniqueMessageId";
import { iframeService } from "../../iframe-service/src/iframe-service";

if (typeof iframeService === "undefined") {
    console.warn("iframeService is undefined. It must be loaded first!");
}

try {
    (function () {
        // Let background.js know that we're ready.
        // We must send a message because there is no other way for background.js to know that we're loaded.
        browser.runtime.sendMessage({ status: "loaded" });

        /*
         * Functions to simulate the mailmerge commands
         */

        async function sendEmail(email: Email) {
            // Sending messages in the background blocked until https://bugzilla.mozilla.org/show_bug.cgi?id=1545930 is resolved.

            // Create the email in a new compose window and then send it.
            const newWin = await browser.compose.beginNew(1, email);

            // There are theoretically more send options, but https://bugzilla.mozilla.org/show_bug.cgi?id=1747456 is the blocker.
            if (newWin.id) {
                const sentStatus = await browser.compose.sendMessage(newWin.id);

                // Broadcast status in case of failure or cancellation
                iframeService.messageChild({
                    type: "SEND_EMAIL_STATUS",
                    id: getUniqueMessageId(),
                    data: { sendEmailStatus: sentStatus },
                });
            }
        }

        // Attach all our function calls to the iframeService
        // iframeService.log = function () {}; // Comment out if you want to see debug messages
        Object.assign(iframeService.commands, {
            sendEmail,
        });
    })();
} catch (e) {
    console.error(e);
}

window.onload = () => {
    const iframe = window.document.getElementById("content-frame");
    if (iframe) iframeService.init(iframe as HTMLIFrameElement);
};
