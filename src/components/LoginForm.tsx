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
// Sugerencia: Importa iconos para darle un toque más profesional
import { LockKeyhole, Mail, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'Ingresa tu correo').email('Correo no válido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function loginErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 401 || status === 400) return 'Credenciales incorrectas o datos inválidos.';
    const data = error.response?.data;
    if (data && typeof data === 'object' && 'message' in data) {
      const m = (data as { message: unknown }).message;
      if (typeof m === 'string') return m;
      if (Array.isArray(m)) return m.filter((x) => typeof x === 'string').join('. ');
    }
    return !error.response ? 'No fue posible conectar con el servidor.' : 'No fue posible iniciar sesión.';
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
      toast.success('Bienvenido de nuevo');
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (e) {
      const message = loginErrorMessage(e);
      setFormError(message);
      toast.error(message);
    }
  });

  return (
    <Card className="w-full max-w-md border-none bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:bg-slate-950/80 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <CardHeader className="space-y-3 pb-8 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LockKeyhole size={28} strokeWidth={2.5} />
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Bienvenido
        </CardTitle>
        <CardDescription className="text-balance text-base text-slate-500 dark:text-slate-400">
          Ingresa tus credenciales para acceder a la plataforma de la CUN.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form className="space-y-6" onSubmit={onSubmit} noValidate>
          <div className="space-y-4">
            <div className="relative group">
              <Input
                label="Correo Institucional"
                type="email"
                autoComplete="email"
                placeholder="nombre.apellido@cun.edu.co"
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                error={errors.email?.message}
                {...register('email')}
              />
              <Mail className="absolute left-3 top-[38px] text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            </div>

            <div className="relative group">
              <Input
                label="Contraseña"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                error={errors.password?.message}
                {...register('password')}
              />
              <LockKeyhole className="absolute left-3 top-[38px] text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            </div>
          </div>

          {formError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/20">
              <AlertCircle size={16} />
              <p>{formError}</p>
            </div>
          )}

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
              size="lg" 
              isLoading={isSubmitting}
            >
              Iniciar Sesión
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-slate-500 dark:text-slate-400">
            ¿Problemas con el acceso?{' '}
            <a href="#" className="font-medium text-primary hover:underline underline-offset-4 transition-colors">
              Contactar a soporte
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}