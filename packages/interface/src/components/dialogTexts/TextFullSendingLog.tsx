import { Text } from "radzionkit";
import { CSSProperties } from "styled-components";

const styles: CSSProperties = {
    margin: 0,
    padding: 0,
    paddingLeft: "1rem",
    paddingRight: "1rem",
};

const TextFullSendingLog = (fullSendingLog: string[]) => {
    return (
        <>
            <Text size={11} color="alert" style={{ ...styles, paddingLeft: "1.5rem" }}>
                - Note that this view is not updated while sending! -
            </Text>
            {fullSendingLog.map((log, index) => (
                <Text size={11} key={index} style={styles}>
                    {log}
                </Text>
            ))}
        </>
    );
};

export default TextFullSendingLog;
