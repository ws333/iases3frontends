import { Text } from "radzion-ui";

const TextEndingSession = (
    <>
        <Text color="supporting">
            You are about to set 'Number of emails to send' to the same or a lower value than the number of emails
            already sent, this will end the current session.
        </Text>
        <Text color="regular">Are you sure you want to continue?</Text>
    </>
);

export default TextEndingSession;
