import { Button } from 'ui-kit';
import { URL_WEBAPP_BASE } from '../constants/constantsImportMeta';

const SwitchUser = () => {
  const onClickSwitchUser = () => {
    window.location.assign(URL_WEBAPP_BASE);
  };

  return <Button onClick={onClickSwitchUser}>Switch user</Button>;
};

export default SwitchUser;
