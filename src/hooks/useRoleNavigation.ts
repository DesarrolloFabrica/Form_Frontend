import { dashboardItemsByRole, sidebarNavByRole } from '@/config/navigation.config';
import { useAuth } from '@/hooks/useAuth';
import type { DashboardNavItem, UserRole } from '@/models';

function isAppRole(role: UserRole | null): role is UserRole {
  return role === 'fabrica' || role === 'desarrollo';
}

export function useRoleNavigation(): {
  dashboardItems: DashboardNavItem[];
  sidebarItems: { label: string; href: string }[];
} {
  const { role } = useAuth();

  if (!isAppRole(role)) {
    return { dashboardItems: [], sidebarItems: [] };
  }

  return {
    dashboardItems: dashboardItemsByRole[role],
    sidebarItems: sidebarNavByRole[role],
  };
}
