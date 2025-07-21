/*
 * Provide a messaging api equivalent to what is supplied by Thunderbird when running as an extension
 */
import { Email } from "../../interface/src/types/modelTypes";
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

    function sendEmail(email: Email) {
        console.log("%c Sending Email", "background: purple; color: white;", email);
    }

    // Attach all our function calls to the iframeService
    iframeService.log = log;
    Object.assign(iframeService.commands, {
        sendEmail,
    });
})();

window.onload = () => {
    const iframe = window.document.getElementById("content-frame");
    iframeService.init(iframe as HTMLIFrameElement);
};
