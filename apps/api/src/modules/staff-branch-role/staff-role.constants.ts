/**
 * Vai trò nhân viên tại chi nhánh — dùng chung API + web (tránh magic string).
 */
export const STAFF_ROLES = [
  'owner',
  'manager',
  'barista',
  'cashier',
  'kitchen',
  'staff',
] as const;

export type StaffRoleValue = (typeof STAFF_ROLES)[number];

export const STAFF_ROLE_SET = new Set<string>(STAFF_ROLES);
