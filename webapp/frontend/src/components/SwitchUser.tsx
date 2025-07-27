import { useNavigate } from 'react-router-dom';
import { Button } from 'ui-kit';
import { useStoreActions } from '../store/storeWithHooks';

const SwitchUser = () => {
  const navigate = useNavigate();

  const resetCurrentLogin = useStoreActions((state) => state.auth.resetCurrentLogin);

  const onClickSwitchUser = () => {
    resetCurrentLogin();
    void navigate('/', { replace: true });
  };

  return <Button onClick={onClickSwitchUser}>Switch user</Button>;
};

export default SwitchUser;
