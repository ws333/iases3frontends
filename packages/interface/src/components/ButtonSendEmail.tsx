import { MouseEventHandler } from "react";

type Props = {
    disabled: boolean;
    onClick: MouseEventHandler;
    emailsSent: number;
};

function ButtonSendEmail({ disabled, onClick, emailsSent }: Props) {
    return (
        <button disabled={disabled} onClick={onClick}>
            {emailsSent === 0 ? "Send Email" : "Continue Sending"}
        </button>
    );
}

export default ButtonSendEmail;
