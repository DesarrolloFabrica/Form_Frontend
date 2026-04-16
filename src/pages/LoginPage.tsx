import { LoginForm } from '@/components/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/routeHelpers';
import { Navigate } from 'react-router-dom';

export function LoginPage() {
  const { isAuthenticated, hasHydrated } = useAuth();

  if (hasHydrated && isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-3">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Iniciar sesión</h1>
        <p className="mx-auto max-w-sm text-pretty text-sm leading-relaxed text-muted">
          Plataforma corporativa para formularios institucionales.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
