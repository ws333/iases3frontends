import { Button } from "radzionkit";
import { MouseEventHandler } from "react";

type Props = {
    disabled?: boolean | string;
    onClick: MouseEventHandler;
};

function ButtonEndSession({ disabled, onClick }: Props) {
    const buttonText = "End session";
    return (
        <Button isDisabled={disabled} onClick={onClick} style={{ marginRight: "0.5rem" }}>
            {buttonText}
        </Button>
    );
}

export default ButtonEndSession;
