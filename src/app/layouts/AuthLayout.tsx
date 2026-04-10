import { Logo } from '@/components/AppShell';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <ThemeToggle className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-12%,rgb(148_163_184/0.12),transparent_58%)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-15%,rgb(148_163_184/0.1),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_100%_100%,rgb(100_116_139/0.08),transparent_52%)] dark:bg-[radial-gradient(ellipse_60%_42%_at_100%_100%,rgb(71_85_105/0.12),transparent_54%)]" />
      <div className="relative w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Logo />
        </div>
        {children}
      </div>
    </div>
  );
}
