import { Button } from "radzion-ui";
import { MouseEventHandler } from "react";

type Props = {
    checkInProgress: boolean;
    disabled: boolean;
    emailsSent: number;
    leftToSendCount: number;
    onClick: MouseEventHandler;
};

function ButtonSendEmails({ checkInProgress, disabled, emailsSent, leftToSendCount, onClick }: Props) {
    const buttonText = checkInProgress
        ? "Please wait..."
        : !leftToSendCount
          ? "No contacts selected"
          : !emailsSent
            ? "Send Emails"
            : "Continue";
    return (
        <Button kind="primary" disabled={disabled} onClick={onClick}>
            {buttonText}
        </Button>
    );
}

export default ButtonSendEmails;
