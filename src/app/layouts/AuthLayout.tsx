import { Logo } from '@/components/AppShell';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <ThemeToggle className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgb(59_130_246/0.14),transparent_55%)] dark:bg-[radial-gradient(ellipse_90%_55%_at_50%_-15%,rgb(59_130_246/0.2),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_100%,rgb(139_92_246/0.08),transparent_50%)] dark:bg-[radial-gradient(ellipse_65%_45%_at_100%_100%,rgb(99_102_241/0.12),transparent_52%)]" />
      <div className="relative w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Logo />
        </div>
        {children}
      </div>
    </div>
  );
}
