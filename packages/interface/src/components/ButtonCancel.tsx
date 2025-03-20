import { Button } from "radzionkit";
import { MouseEventHandler } from "react";

type Props = {
    aborted?: boolean;
    checkInProgress?: boolean;
    disabled?: boolean | string;
    onClick: MouseEventHandler;
};

function ButtonCancel({ aborted, checkInProgress, disabled, onClick }: Props) {
    const buttonText = aborted || checkInProgress ? "Please wait..." : "Cancel";
    return (
        <Button isDisabled={disabled} onClick={onClick}>
            {buttonText}
        </Button>
    );
}

export default ButtonCancel;
