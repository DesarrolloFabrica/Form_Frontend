import { dashboardItemsByRole, sidebarNavByRole, type SidebarNavConfig } from '@/config/navigation.config';
import { useAuth } from '@/hooks/useAuth';
import type { DashboardNavItem, UserRole } from '@/models';

function isAppRole(role: UserRole | null): role is UserRole {
  return role === 'fabrica' || role === 'desarrollo';
}

export function useRoleNavigation(): {
  dashboardItems: DashboardNavItem[];
  sidebarNav: SidebarNavConfig | null;
} {
  const { role } = useAuth();

  if (!isAppRole(role)) {
    return { dashboardItems: [], sidebarNav: null };
  }

  return {
    dashboardItems: dashboardItemsByRole[role],
    sidebarNav: sidebarNavByRole[role],
  };
}
