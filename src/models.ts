export const USER_ROLES = ['FABRICA_COORDINADOR', 'DESARROLLO', 'ADMIN'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

export interface DashboardNavItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: 'factory' | 'code' | 'license';
}
