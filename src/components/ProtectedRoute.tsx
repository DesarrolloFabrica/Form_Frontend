import { Loading } from '@/components/Loading';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/routeHelpers';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function ProtectedRoute() {
  const { isAuthenticated, hasHydrated } = useAuth();
  const location = useLocation();

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loading label="Preparando sesión…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
