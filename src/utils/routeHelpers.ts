import type { UserRole } from '@/models';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  INVENTORY_FABRICA: '/inventario/fabrica',
  INVENTORY_DESARROLLO: '/inventario/desarrollo',
  INVENTORY_LICENCIAS: '/inventario/licencias',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

/** Rutas de inventario con restricción por rol. */
export const roleRestrictedPaths: {
  path: string;
  allowedRoles: UserRole[];
}[] = [
  {
    path: ROUTES.INVENTORY_FABRICA,
    allowedRoles: ['FABRICA_COORDINADOR', 'ADMIN'],
  },
  {
    path: ROUTES.INVENTORY_DESARROLLO,
    allowedRoles: ['DESARROLLO', 'ADMIN'],
  },
  {
    path: ROUTES.INVENTORY_LICENCIAS,
    allowedRoles: ['FABRICA_COORDINADOR', 'DESARROLLO', 'ADMIN'],
  },
];

export function getAllowedRolesForPath(pathname: string): UserRole[] | null {
  const entry = roleRestrictedPaths.find((r) => r.path === pathname);
  return entry ? [...entry.allowedRoles] : null;
}

export function isPathAllowedForRole(pathname: string, role: UserRole): boolean {
  const allowed = getAllowedRolesForPath(pathname);
  if (!allowed) return true;
  return allowed.includes(role);
}
