import { Button, Input } from '@/components/UiPrimitives';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UiSurfaces';
import { useAuth } from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ROUTES } from '@/utils/routeHelpers';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Ingresa tu correo').email('Correo no válido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from ?? ROUTES.DASHBOARD;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await login(values.email, values.password);
      toast.success('Bienvenido');
      navigate(from, { replace: true });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'No fue posible iniciar sesión.';
      setFormError(message);
      toast.error(message);
    }
  });

  return (
    <Card className="border-border/80 shadow-2xl shadow-black/40">
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>Ingresa con tu correo institucional. La contraseña aún no se valida.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          <Input
            label="Correo"
            type="email"
            autoComplete="email"
            placeholder="nombre.apellido@cun.edu.co"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          {formError ? <p className="text-sm text-danger">{formError}</p> : null}
          <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
            Ingresar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
