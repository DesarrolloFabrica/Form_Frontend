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
    <Card className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white/90 shadow-[0_4px_24px_-4px_rgb(15_23_42/0.08),0_24px_48px_-12px_rgb(15_23_42/0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-[#141b27]/97 dark:shadow-[0_0_0_1px_rgb(255_255_255/0.04)_inset,0_24px_56px_-12px_rgb(0_0_0/0.55),0_12px_24px_-8px_rgb(0_0_0/0.35)]">
      <CardHeader className="space-y-4 border-b border-slate-200/80 px-6 pb-8 pt-8 text-center dark:border-white/8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 text-slate-600 dark:border-white/8 dark:bg-white/4 dark:text-slate-300">
          <LockKeyhole size={24} strokeWidth={2} />
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.65rem] dark:text-[#f1f4f9]">
          Bienvenido
        </CardTitle>
        <CardDescription className="text-balance text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
          Ingresa tus credenciales para acceder a la plataforma de la CUN.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-8 pt-6">
        <form className="space-y-6" onSubmit={onSubmit} noValidate>
          <div className="space-y-4">
            <div className="group relative">
              <Input
                label="Correo Institucional"
                type="email"
                autoComplete="email"
                placeholder="nombre.apellido@cun.edu.co"
                className="pl-10 transition-[box-shadow,border-color] duration-200 focus-visible:ring-slate-400/25 dark:focus-visible:ring-white/15"
                error={errors.email?.message}
                {...register('email')}
              />
              <Mail
                className="pointer-events-none absolute left-3 top-[38px] text-slate-400 transition-colors group-focus-within:text-slate-600 dark:text-slate-500 dark:group-focus-within:text-slate-300"
                size={18}
              />
            </div>

            <div className="group relative">
              <Input
                label="Contraseña"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="pl-10 transition-[box-shadow,border-color] duration-200 focus-visible:ring-slate-400/25 dark:focus-visible:ring-white/15"
                error={errors.password?.message}
                {...register('password')}
              />
              <LockKeyhole
                className="pointer-events-none absolute left-3 top-[38px] text-slate-400 transition-colors group-focus-within:text-slate-600 dark:text-slate-500 dark:group-focus-within:text-slate-300"
                size={18}
              />
            </div>
          </div>

          {formError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200/90 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/25 dark:bg-red-950/35 dark:text-red-200">
              <AlertCircle size={16} className="shrink-0" />
              <p>{formError}</p>
            </div>
          )}

          <div className="pt-1">
            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full border border-slate-300/80 bg-slate-900 text-[15px] font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-400/40 dark:border-white/15 dark:bg-[#e8eaef] dark:text-[#0d1117] dark:shadow-[0_1px_0_0_rgb(255_255_255/0.35)_inset] dark:hover:bg-[#f2f4f7] dark:focus-visible:ring-white/25"
            >
              Iniciar sesión
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}