import { dashboardItemsByRole, sidebarNavByRole } from '@/config/navigation.config';
import { useAuth } from '@/hooks/useAuth';
import type { DashboardNavItem, UserRole } from '@/models';

type ActiveRole = Extract<UserRole, 'FABRICA_COORDINADOR' | 'DESARROLLO'>;

function isActiveRole(role: UserRole | null): role is ActiveRole {
  return role === 'FABRICA_COORDINADOR' || role === 'DESARROLLO';
}

export function useRoleNavigation(): {
  dashboardItems: DashboardNavItem[];
  sidebarItems: { label: string; href: string }[];
} {
  const { role } = useAuth();

  if (!isActiveRole(role)) {
    return { dashboardItems: [], sidebarItems: [] };
  }

  return {
    dashboardItems: dashboardItemsByRole[role],
    sidebarItems: sidebarNavByRole[role],
  };
}
