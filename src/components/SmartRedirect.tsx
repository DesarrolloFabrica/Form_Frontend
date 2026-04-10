import { Loading } from '@/components/Loading';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/routeHelpers';
import { Navigate } from 'react-router-dom';

export function SmartRedirect() {
  const { isAuthenticated, hasHydrated } = useAuth();

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loading />
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} replace />;
}
