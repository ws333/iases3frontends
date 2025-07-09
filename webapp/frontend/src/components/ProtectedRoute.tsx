import { InteractionType } from '@azure/msal-browser';
import { MsalAuthenticationTemplate, useMsal } from '@azure/msal-react';
import { Navigate, Outlet } from 'react-router';

function ProtectedRoute() {
  const { accounts } = useMsal();

  const isAuthenticated = accounts.length > 0;

  return (
    <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
      {isAuthenticated ? <Outlet /> : <Navigate to="/" replace />}
    </MsalAuthenticationTemplate>
  );
}

export default ProtectedRoute;
