import { Text } from "radzionkit";
import { Spinner } from "radzionkit/ui/loaders/Spinner";
import { CSSProperties } from "react";
import HeaderWithUfo from "./HeaderWithUfo";

const divStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100%",
};

function Loading() {
    console.log("*Debug* -> LoadingContacts.tsx -> rendering");
    return (
        <>
            <div style={divStyles}>
                <HeaderWithUfo />
                <br />
                <Text size={42}>
                    <Spinner />
                </Text>
            </div>
        </>
    );
}

export default Loading;
