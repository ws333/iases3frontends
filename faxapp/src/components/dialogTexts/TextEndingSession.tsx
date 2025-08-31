import { CSSProperties } from 'react';
import { Text } from 'ui-kit';

const styles: CSSProperties = {
  margin: 0,
};
const TextEndingSession = (
  <>
    <Text style={styles}>
      You are about to set 'Number of faxes to send' to the same or a lower value than the number of faxes already sent,
      this will end the current session.
    </Text>
    <Text style={styles}>Are you sure you want to continue?</Text>
  </>
);

export default TextEndingSession;
