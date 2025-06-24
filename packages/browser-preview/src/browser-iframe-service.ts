/*
 * Provide a messaging api equivalent to what is supplied by Thunderbird when running as an extension
 */
import { Email, Prefs } from "../../interface/src/types/modelTypes";
import { Message, iframeService } from "../../iframe-service/src/iframe-service";

if (typeof iframeService === "undefined") {
    console.warn("iframeService is undefined. It must be loaded first!");
}

(function () {
    // Log a message to #processing-log
    function log(message: Message) {
        const { type, direction, ...rest } = message;
        const li = document.createElement("li");
        const div1 = document.createElement("div");
        const div2 = document.createElement("div");
        div1.appendChild(document.createTextNode(type));
        div2.appendChild(document.createTextNode(JSON.stringify(rest, null, 4)));

        li.appendChild(div1);
        li.appendChild(div2);
        li.classList.add(direction);
        div1.classList.add("log-item");

        // Set it up so clicking on an item in the log with shrink or expand its contents
        let hidden = false;
        function hideLogContents() {
            hidden = !hidden;
            if (hidden) {
                div2.classList.add("hidden");
                div1.classList.add("has-hidden-contents");
            } else {
                div2.classList.remove("hidden");
                div1.classList.remove("has-hidden-contents");
            }
        }
        div1.addEventListener("click", hideLogContents);
        hideLogContents();

        const logElm = document.getElementById("processing-log");
        if (logElm) {
            logElm.appendChild(li);
        }
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

    function getPreferences() {
        let prefs = getDefaultPreferences();
        try {
            const storedPrefs = window.localStorage.getItem("prefs");
            prefs = storedPrefs ? JSON.parse(storedPrefs) : prefs;
        } catch (error) {
            console.warn("error when decoding prefs from JSON", error);
        }
        return prefs;
    }

    function setPreferences(prefs: Prefs) {
        const newPrefs = { ...getPreferences(), ...prefs };
        window.localStorage.setItem("prefs", JSON.stringify(newPrefs));
    }

    function getLocalizedStrings() {
        return {
            next: "Next",
            previous: "Previous",
            cancel: "Cancel",
            send: "Send",
            data: "Data",
            dataInfo:
                "Open a spreadsheet file (.csv, .xlsx, .ods, etc.) or copy-and-paste data into the spreadsheet below.",
            dataHeaderWarning:
                "The first row of the data act as keys for your email template. The keys must be single words without spaces or special characters.",
            openAFile: "Open a file...",
            settings: "Settings",
            preview: "Preview",
            sendMode: "Send mode:",
            sendModeDesc: "Set how messages will be delivered. Send Later will leave messages in the Drafts folder.",
            sendModeNow: "Send Now",
            sendModeLater: "Send Later",
            sendModeDraft: "Save as Draft",
            messageDelay: "Message delay:",
            messageDelayDesc: "Dealy, in seconds, between sending messages.",
            sendMessageRange: "Send Message Range:",
            sendMessageRangeDesc: "Send only specific messages as specified by this range.",
            previewEmpty: "No emails to preview. Try loading data in the {0} tab.",
            previewPreviewing: "Previewing {0} of {1}",
            about: "About",
            developers: "Developers",
            support: "Support",
            license: "License",
            donate: "Donate",
            euro: "{0} €",
            dollar: "$ {0}",
            current: "Current:",
            total: "Total:",
            time: "Time:",
            progress: "Progress:",
            status: "Status:",
            sending: "Sending...",
            waiting: "Waiting...",
        };
    }

    function sendEmails(emails: Email[]) {
        for (const email of emails) {
            console.log("%c Sending Email", "background: blue; color: white;", email);
        }
    }

    function sendEmail(email: Email, sendmode: Prefs["sendmode"]) {
        console.log("%c Sending Email", "background: purple; color: white;", email, sendmode);
    }

    function cancel() {
        alert("Cancel pressed");
    }

    function openUrl(url: string | URL) {
        window.open(url, "_blank");
    }

    // Attach all our function calls to the iframeService
    iframeService.log = log;
    Object.assign(iframeService.commands, {
        getDefaultPreferences,
        getPreferences,
        getLocalizedStrings,
        setPreferences,
        sendEmails,
        sendEmail,
        openUrl,
        cancel,
    });
})();

window.onload = () => {
    const iframe = window.document.getElementById("content-frame");
    iframeService.init(iframe as HTMLIFrameElement);
};
