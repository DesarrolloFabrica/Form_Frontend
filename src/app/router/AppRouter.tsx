import { AppRoutes } from '@/app/router/routes';
import { BrowserRouter } from 'react-router-dom';

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
