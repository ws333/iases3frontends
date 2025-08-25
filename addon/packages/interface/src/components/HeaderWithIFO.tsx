import { CSSProperties } from "react";
import Header from "./Header";
import IconIFO from "./IconIFO";

function HeaderWithIFO() {
    return (
        <div style={outerDivStyles}>
            <IconIFO />
            <div style={divDynamicGapStyles}></div>
            <Header />
        </div>
    );
}

export default HeaderWithIFO;

const outerDivStyles: CSSProperties = {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
};

const divDynamicGapStyles: CSSProperties = {
    height: "3%",
};
