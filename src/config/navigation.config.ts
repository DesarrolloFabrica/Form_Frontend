import type { DashboardNavItem, UserRole } from '@/models';
import { ROUTES } from '@/utils/routeHelpers';

const fabricaPrimary: DashboardNavItem = {
  id: 'inv-fabrica',
  title: 'Inventario Fábrica',
  description: 'Registro y seguimiento de requisiciones y materiales de fábrica.',
  href: ROUTES.INVENTORY_FABRICA,
  icon: 'factory',
};

const desarrolloPrimary: DashboardNavItem = {
  id: 'inv-desarrollo',
  title: 'Inventario Desarrollo',
  description: 'Seguimiento de proyectos, entregas y estados del área de desarrollo.',
  href: ROUTES.INVENTORY_DESARROLLO,
  icon: 'code',
};

const licencias: DashboardNavItem = {
  id: 'inv-licencias',
  title: 'Inventario Licencias',
  description: 'Control de licencias, vigencias y costos asociados.',
  href: ROUTES.INVENTORY_LICENCIAS,
  icon: 'license',
};

export const dashboardItemsByRole: Record<UserRole, DashboardNavItem[]> = {
  fabrica: [fabricaPrimary, licencias],
  desarrollo: [desarrolloPrimary, licencias],
};

export interface SidebarNavLink {
  label: string;
  href: string;
}

/** Panel + inventarios agrupados bajo «Formulario» en el menú lateral. */
export interface SidebarNavConfig {
  panel: SidebarNavLink;
  formulario: SidebarNavLink[];
}

export const sidebarNavByRole: Record<UserRole, SidebarNavConfig> = {
  fabrica: {
    panel: { label: 'Panel', href: ROUTES.DASHBOARD },
    formulario: [
      { label: 'Inventario Fábrica', href: ROUTES.INVENTORY_FABRICA },
      { label: 'Inventario Licencias', href: ROUTES.INVENTORY_LICENCIAS },
    ],
  },
  desarrollo: {
    panel: { label: 'Panel', href: ROUTES.DASHBOARD },
    formulario: [
      { label: 'Inventario Desarrollo', href: ROUTES.INVENTORY_DESARROLLO },
      { label: 'Inventario Licencias', href: ROUTES.INVENTORY_LICENCIAS },
    ],
  },
};
