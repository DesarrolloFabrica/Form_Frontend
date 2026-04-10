import type { UserRole } from '@/models';

/**
 * Correos explícitos por rol (prioridad sobre reglas por substring).
 * Amplía estas listas cuando tengas los correos definitivos.
 */
export const explicitFabricaEmails: readonly string[] = [
  'coordinador.fabrica@cun.edu.co',
  'fabrica.team@cun.edu.co',
];

export const explicitDesarrolloEmails: readonly string[] = [
  'yesid.desarrollo@cun.edu.co',
  'desarrollo.team@cun.edu.co',
];

/** Si el correo contiene esta subcadena (case-insensitive), se asigna el rol. */
export const fabricaEmailSubstring = 'fabrica';

/** Si el correo contiene esta subcadena (case-insensitive), se asigna el rol. */
export const desarrolloEmailSubstring = 'desarrollo';

/** Roles que pueden iniciar sesión en la fase mock (ADMIN reservado). */
export const loginEnabledRoles: readonly UserRole[] = [
  'FABRICA_COORDINADOR',
  'DESARROLLO',
];

export const authStorageKey = 'forms-cun-auth';
