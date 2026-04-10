import { Loading } from '@/components/Loading';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES, isPathAllowedForRole } from '@/utils/routeHelpers';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function RoleGuard() {
  const { role, hasHydrated, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!hasHydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated || !role) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!isPathAllowedForRole(location.pathname, role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}
