import { CSSProperties } from 'styled-components';
import { Text } from 'ui-kit';

const styles: CSSProperties = {
  margin: 0,
  marginBottom: '1rem',
};

const TextResetSendingQueue = (
  <>
    <Text style={{ ...styles, textAlign: 'center' }}>Are you sure you want to reset the sending queue counter?</Text>
  </>
);

export default TextResetSendingQueue;
