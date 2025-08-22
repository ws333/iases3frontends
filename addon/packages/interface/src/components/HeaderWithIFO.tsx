import { CSSProperties, useEffect, useState } from "react";
import Header from "./Header";
import IconIFO, { iconSize } from "./IconIFO";

type Props = {
    showWhenMounted?: boolean;
};
/**
 * - Setting showWhenMounted prevents IconIFO visual artifacts by rendering only after mount
 * - This can sometimes cause other visual side effects so only enable when needed
 */
function HeaderWithIFO({ showWhenMounted }: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (showWhenMounted) setMounted(true);
    }, [showWhenMounted]);

    return (
        <>
            {!showWhenMounted || mounted ? (
                <IconIFO />
            ) : (
                // Placeholder to prevent layout shift
                <div style={divIconPlaceHolder} />
            )}
            <div style={divDynamicGapStyles}></div>
            <Header />
        </>
    );
}

export default HeaderWithIFO;

const divDynamicGapStyles: CSSProperties = {
    height: "3%",
};

const divIconPlaceHolder: CSSProperties = {
    height: iconSize,
    width: "100%",
    visibility: "hidden",
};
