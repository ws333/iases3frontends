import { Spinner } from "ui-kit";
import { Text } from "ui-kit";
import { divContainerButtons, outerDivStyles, spinnerContainerStyles, spinnerHeight } from "../styles/loadingStyles";
import HeaderWithIFO from "./HeaderWithIFO";

type Props = {
    showSpinner?: boolean;
};

function Loading({ showSpinner = true }: Props) {
    return (
        <div style={outerDivStyles}>
            <div style={divContainerButtons}>
                <HeaderWithIFO />
                <div style={spinnerContainerStyles}>
                    <Text size={spinnerHeight}>{showSpinner ? <Spinner /> : null}</Text>
                </div>
            </div>
        </div>
    );
}

export default Loading;
