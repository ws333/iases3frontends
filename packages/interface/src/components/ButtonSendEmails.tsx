import { MouseEventHandler } from "react";

type Props = {
    disabled: boolean;
    onClick: MouseEventHandler;
    emailsSent: number;
};

function ButtonSendEmails({ disabled, onClick, emailsSent }: Props) {
    return (
        <button disabled={disabled} onClick={onClick}>
            {emailsSent === 0 ? "Send Emails" : "Continue"}
        </button>
    );
}

export default ButtonSendEmails;
