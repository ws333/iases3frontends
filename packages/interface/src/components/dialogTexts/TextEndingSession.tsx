import { Text } from "radzionkit";
import { CSSProperties } from "react";

const styles: CSSProperties = {
    margin: 0,
};
const TextEndingSession = (
    <>
        <Text color="supporting" style={styles}>
            You are about to set 'Number of emails to send' to the same or a lower value than the number of emails
            already sent, this will end the current session.
        </Text>
        <Text color="regular" style={styles}>
            Are you sure you want to continue?
        </Text>
    </>
);

export default TextEndingSession;
