import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../auth/authConfig';

const LogIn = () => {
  const { instance } = useMsal();

  const onClickLogin = () => {
    instance
      .loginRedirect({
        ...loginRequest,
      })
      .catch((error: unknown) => console.log(error));
  };

  return (
    <div>
      <h1>Interstellar Alliance Social Experiment Step 3</h1>
      <button onClick={onClickLogin}>Login with Microsoft</button>
    </div>
  );
};

export default LogIn;
