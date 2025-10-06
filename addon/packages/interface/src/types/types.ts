import type { JSX } from "react";
import { ContactI3C } from "./typesI3C";

export type Provider = "MS" | "Google";

export type CurrentLogin = {
    provider: Provider | null;
    userEmail: string;
    accessToken?: string;
};

export type Email = Partial<Pick<ContactI3C, "uid">> &
    Pick<browser.compose.ComposeDetails, "to" | "from" | "subject" | "body">;

export type StatusBackend = {
    status: "OK" | "ERROR";
    message?: string; // Message to display to user
    error?: string;
    httpStatus?: number;
};

export type ProjectEnvProps = {
    environment: ProjectEnvironment;
    sendEmailFn: (email: Email) => Promise<StatusBackend> | Promise<void>;
    sendEmailPreflightFn?: () => Promise<StatusBackend>;
    HeaderButtonsComponent?: React.ReactElement;
};

export type EmailComponentProps = {
    name: string;
};

export type ProjectEnvironment = "addon" | "webapp" | "unknown";

export type TEmailComponent = ({ name }: EmailComponentProps) => JSX.Element;

export type FileContent = number[];

export type MessagePayload = {
    type:
        | "ECHO"
        | "SEND_EMAIL"
        | "SEND_EMAIL_STATUS" // Used to keep EmailSender updated in case of failure or cancellation
        | "CANCEL"
        | "INITIALIZE_PARENT";
    id?: string | number;
    source?: "CHILD" | "PARENT";
    reply_id?: string | number;
    data?: {
        email?: Email;
        sendEmailStatus?: browser.compose._SendMessageReturnReturn;
    };
};
