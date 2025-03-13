import { MouseEventHandler } from "react";

type Props = {
    disabled?: boolean;
    onClick: MouseEventHandler;
};

function ButtonCancel({ disabled, onClick }: Props) {
    return (
        <button disabled={disabled} onClick={onClick}>
            Cancel
        </button>
    );
}

export default ButtonCancel;
