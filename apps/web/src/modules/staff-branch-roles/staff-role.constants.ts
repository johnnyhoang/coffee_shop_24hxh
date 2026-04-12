/** Đồng bộ với API `STAFF_ROLES` — nhãn hiển thị tiếng Việt */
export const STAFF_ROLES = [
  'owner',
  'manager',
  'barista',
  'cashier',
  'kitchen',
  'staff',
] as const;

export type StaffRoleCode = (typeof STAFF_ROLES)[number];

export const STAFF_ROLE_LABELS: Record<StaffRoleCode, string> = {
  owner: 'Chủ quán',
  manager: 'Quản lý',
  barista: 'Pha chế',
  cashier: 'Thu ngân',
  kitchen: 'Bếp',
  staff: 'Nhân viên',
};
