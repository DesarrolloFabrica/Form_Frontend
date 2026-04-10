import { Loading } from '@/components/Feedback';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES, isPathAllowedForRole } from '@/utils/routeHelpers';
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
