import { appConfig } from '@/config/app.config';
import { useEffect } from 'react';

export function usePageTitle(title: string): void {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} · ${appConfig.shortName}`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
