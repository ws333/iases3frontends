import { renderToString } from "react-dom/server";
import { EmailComponentProps, TEmailComponent } from "../types/types";

/**
 * - Render email HTML for currently selected language with contact name
 *
 * - Adding a zero-width space (\&#x200B;) to the email text to prevent the email being sent as ascii
 *   which cause any non ascii characters in the senders name to be encoded incorrectly
 */
export const renderEmail = (Component: TEmailComponent, props: EmailComponentProps) => {
    return renderToString(<Component {...props} />) + "&#x200B;";
};
