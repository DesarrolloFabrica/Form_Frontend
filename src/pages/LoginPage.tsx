import { LoginForm } from '@/components/LoginForm';
import { appConfig } from '@/config/app.config';
import { useAuth } from '@/hooks/useAuth';
import { usePageTitle } from '@/hooks/usePageTitle';
import { ROUTES } from '@/utils/routeHelpers';
import { Navigate } from 'react-router-dom';

export function LoginPage() {
  usePageTitle('Ingreso');
  const { isAuthenticated, hasHydrated } = useAuth();

  if (hasHydrated && isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {appConfig.name}
        </h1>
        <p className="text-sm text-muted">
          Accede al panel de inventarios. Usa un correo de prueba que contenga{' '}
          <span className="text-foreground/80">fabrica</span> o{' '}
          <span className="text-foreground/80">desarrollo</span>, o los correos mock del equipo.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
