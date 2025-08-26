import { CSSProperties, useEffect, useState } from "react";
import Header from "./Header";
import IconIFO, { iconSize } from "./IconIFO";

type Props = {
    showIFOWhenMounted?: boolean;
};

/**
 * - Setting showIFOWhenMounted prevents IconIFO visual artifacts by rendering only after mount
 * - Uses a skeleton placeholder that matches the exact dimensions and structure of IconIFO
 * - Prevents layout shift during image loading by waiting for image to be ready
 */
function HeaderWithIFO({ showIFOWhenMounted }: Props) {
    const [imageReady, setImageReady] = useState(false);

    useEffect(() => {
        if (!showIFOWhenMounted) setImageReady(true);
    }, [showIFOWhenMounted]);

    const handleImageLoad = () => {
        setImageReady(true);
    };

    const shouldShowIcon = showIFOWhenMounted ? imageReady : true;

    return (
        <div style={outerDivStyles}>
            {shouldShowIcon ? (
                <IconIFO onImageLoad={handleImageLoad} />
            ) : (
                <>
                    <div style={hiddenPreloadContainer}>
                        <IconIFO onImageLoad={handleImageLoad} />
                    </div>
                    <div style={placeholderIconStyles} />
                </>
            )}
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

const placeholderIconStyles: CSSProperties = {
    width: iconSize,
    height: iconSize,
    backgroundColor: "transparent",
    border: "none",
};

// Hidden container for preloading the image
const hiddenPreloadContainer: CSSProperties = {
    position: "absolute",
    top: "-9999px",
    left: "-9999px",
    visibility: "hidden",
    pointerEvents: "none",
};
