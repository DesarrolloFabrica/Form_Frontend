import { Button, Input } from '@/components/UiPrimitives';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UiSurfaces';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/routeHelpers';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Ingresa tu correo').email('Correo no válido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function loginErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401 || status === 400) {
      return 'Credenciales incorrectas o datos inválidos.';
    }
    const data = error.response?.data;
    if (data && typeof data === 'object' && 'message' in data) {
      const m = (data as { message: unknown }).message;
      if (typeof m === 'string') return m;
      if (Array.isArray(m)) return m.filter((x) => typeof x === 'string').join('. ');
    }
    if (!error.response) {
      return 'No fue posible conectar con el servidor.';
    }
    return 'No fue posible iniciar sesión. Intenta nuevamente.';
  }
  return error instanceof Error ? error.message : 'No fue posible iniciar sesión.';
}

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

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
      await login(values.email.trim(), values.password);
      toast.success('Bienvenido');
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (e) {
      const message = loginErrorMessage(e);
      setFormError(message);
      toast.error(message);
    }
  });

  return (
    <Card className="border-border/80 shadow-2xl shadow-black/40">
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>Ingresa el correo y la contraseña registrados en el sistema.</CardDescription>
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
