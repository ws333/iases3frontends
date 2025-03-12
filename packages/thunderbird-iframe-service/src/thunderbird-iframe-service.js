import { iframeService } from "@iases3/iframe-service";
/*
 * provide a messaging api equivalent to what is supplied by Thunderbird when
 * running as an extension
 */

if (typeof iframeService === "undefined") {
    console.warn("iframeService is undefined. It must be loaded first!");
}

try {
    (function () {
        // Set up some internal globals
        let composeTabId = null;
        // background.js will let us know what the id of the current compose window
        // is with a message.
        browser.runtime.onMessage.addListener(function (message, sender) {
            if (sender.id.toLowerCase() === "iases3@iase.one") {
                if (message.activeTabId != null) {
                    composeTabId = message.activeTabId;
                }
            }
        });

        // Let background.js know that we're ready. We must send a message
        // because there is no other way for background.js to know that we're
        // loaded.
        browser.runtime.sendMessage({ status: "loaded" });

        /**
         * Find the sender's email given a `composeDetails` object as
         * returned by the Thunderbird API.
         *
         * @param {*} composeDetails
         */
        async function getSenderFromComposeDetails(composeDetails) {
            const activeIdentityId = composeDetails.identityId;
            const accounts = await browser.accounts.list();
            const activeAccount = accounts.find((account) =>
                account.identities.some((ident) => ident.id === activeIdentityId)
            );
            if (activeAccount == null) {
                console.warn("Could not find the active account for a message with composeDetails:", composeDetails);
                return "";
            }

            const identity = activeAccount.identities.find((ident) => ident.id === activeIdentityId);
            if (identity == null) {
                console.warn("Could not find identity", activeIdentityId, "in account", activeAccount);
                return "";
            }

            const sender = identity.name ? `${identity.name} <${identity.email}>` : identity.email;
            return sender;
        }

        /*
         * Functions to simulate the mailmerge commands
         */
        function getDefaultPreferences() {
            return {
                delay: 0,
                sendmode: "now",
                range: "",
                fileName: "",
                fileContents: [],
            };
        }

        async function getPreferences() {
            let prefs = getDefaultPreferences();
            try {
                const fetched = await browser.storage.local.get("prefs");
                if (fetched.prefs) {
                    prefs = fetched.prefs;
                }
            } catch (e) {
                console.warn("error when loading prefs");
            }
            return prefs;
        }

        async function setPreferences(prefs) {
            let newPrefs = { ...(await getPreferences()), ...prefs };
            await browser.storage.local.set({ prefs: newPrefs });
        }

        function getLocalizedStrings() {
            const stringNames = [
                "next",
                "previous",
                "cancel",
                "send",
                "data",
                "dataInfo",
                "openAFile",
                "dataHeaderWarning",
                "settings",
                "preview",
                "sendMode",
                "sendModeDesc",
                "sendModeNow",
                "sendModeLater",
                "sendModeDraft",
                "messageDelay",
                "messageDelayDesc",
                "sendMessageRange",
                "sendMessageRangeDesc",
                "previewEmpty",
                "previewPreviewing",
                "about",
                "developers",
                "support",
                "license",
                "donate",
                "euro",
                "dollar",
                "current",
                "total",
                "time",
                "progress",
                "status",
                "sending",
                "waiting",
            ];
            const ret = {};
            for (const name of stringNames) {
                ret[name] = browser.i18n.getMessage(name);
            }
            return ret;
        }

        async function sendEmail(email, sendmode) {
            // Sending messages in the background blocked until https://bugzilla.mozilla.org/show_bug.cgi?id=1545930 is resolved.

            // Create the email in a new compose window and then send it.
            const newWin = await browser.compose.beginNew(null, email);

            // There are theoretically more send options, but https://bugzilla.mozilla.org/show_bug.cgi?id=1747456 is the blocker.
            await browser.compose.sendMessage(newWin.id, {
                mode: sendmode === "now" ? "sendNow" : "sendLater",
            });
        }

        function cancel() {
            // If the cancel button was clicked, close the window
            browser.runtime.sendMessage({ action: "close" });
        }

        function openUrl(url) {
            window.open(url, "_blank");
        }

        // attach all our function calls to the iframeService
        // iframeService.log = function () {}; // Comment out if you want to see debug messages
        Object.assign(iframeService.commands, {
            getDefaultPreferences,
            getPreferences,
            getLocalizedStrings,
            setPreferences,
            sendEmail,
            openUrl,
            cancel,
        });

        /**
         * When `{{email}}` is specified, since it's invalid, TB 78 will change
         * it to `{{email}} <>`. We want to strip the extra `<>` away.
         *
         * @param {string} str
         * @returns
         */
        function cleanupTemplateAddress(str) {
            return str.replace("<>", "").trim();
        }
    })();
} catch (e) {
    console.error(e);
}

window.onload = () => {
    const iframe = window.document.getElementById("content-frame");
    iframeService.init(iframe);
};
