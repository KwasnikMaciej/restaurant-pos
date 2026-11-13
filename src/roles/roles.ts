export type SystemRole = 'waiter' | 'kitchen'

export type RoleDefinition = {
  id: SystemRole
  label: string
  description: string
  available: boolean
}

export const systemRoles: RoleDefinition[] = [
  {
    id: 'waiter',
    label: 'Kelner',
    description: 'Obsługa stolików, zamówień i rozliczeń',
    available: true,
  },
  {
    id: 'kitchen',
    label: 'Kucharz',
    description: 'Kolejka dań i obsługa przygotowania zamówień',
    available: true,
  },
]

export const ACTIVE_ROLE_STORAGE_KEY = 'franczesko:active-role'

export function isSystemRole(value: unknown): value is SystemRole {
  return typeof value === 'string' && systemRoles.some((role) => role.id === value && role.available)
}
