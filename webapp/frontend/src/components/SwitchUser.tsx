import { useNavigate } from 'react-router-dom';
import { Button } from 'ui-kit';

const SwitchUser = () => {
  const navigate = useNavigate();

  const onClickSwitchUser = () => {
    void navigate('/', { replace: true });
  };

  return <Button onClick={onClickSwitchUser}>Switch user</Button>;
};

export default SwitchUser;
