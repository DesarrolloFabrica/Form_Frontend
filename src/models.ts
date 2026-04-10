export const USER_ROLES = ['fabrica', 'desarrollo'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface AuthUser {
  id: number;
  nombre: string;
  correo: string;
  rol: UserRole;
}

export interface DashboardNavItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: 'factory' | 'code' | 'license';
}
