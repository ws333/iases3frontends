import { CSSProperties } from 'styled-components';
import { Text } from 'ui-kit';

const styles: CSSProperties = {
  textAlign: 'center',
};

const TextDeletingApiKey = (
  <>
    <Text style={{ ...styles, color: 'orange' }}>You are about to delete the registered API key!</Text>
    <Text style={{ ...styles, marginTop: '1em' }}>Are you sure?</Text>
  </>
);

export default TextDeletingApiKey;
