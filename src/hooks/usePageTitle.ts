import { appConfig } from '@/config/app.config';
import { useEffect } from 'react';

export function usePageTitle(title: string): void {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} · ${appConfig.defaultPageTitle}`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
