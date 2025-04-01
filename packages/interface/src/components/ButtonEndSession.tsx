import { Button } from "radzionkit";
import { MouseEventHandler } from "react";

type Props = {
    disabled?: boolean | string;
    onClick: MouseEventHandler;
};

function ButtonEndSession({ disabled, onClick }: Props) {
    const buttonText = "End session";
    return (
        <Button className="session_buttons" isDisabled={disabled} onClick={onClick}>
            {buttonText}
        </Button>
    );
}

export default ButtonEndSession;
