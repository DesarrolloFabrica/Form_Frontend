import { AuthLayout } from '@/app/layouts/AuthLayout';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import { ProtectedRoute, RoleGuard, SmartRedirect } from '@/components/RouteGuards';
import { DashboardPage } from '@/pages/DashboardPage';
import { InventoryDesarrolloPage } from '@/pages/InventoryDesarrolloPage';
import { InventoryFabricaPage } from '@/pages/InventoryFabricaPage';
import { InventoryLicenciasPage } from '@/pages/InventoryLicenciasPage';
import { LoginPage } from '@/pages/LoginPage';
import { ROUTES } from '@/utils/routeHelpers';
import { Route, Routes } from 'react-router-dom';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SmartRedirect />} />
      <Route
        path={ROUTES.LOGIN}
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route element={<RoleGuard />}>
            <Route path={ROUTES.INVENTORY_FABRICA} element={<InventoryFabricaPage />} />
            <Route path={ROUTES.INVENTORY_DESARROLLO} element={<InventoryDesarrolloPage />} />
            <Route path={ROUTES.INVENTORY_LICENCIAS} element={<InventoryLicenciasPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<SmartRedirect />} />
    </Routes>
  );
}
