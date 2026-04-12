import * as Yup from 'yup';
import {
  STAFF_ROLE_LABELS,
  STAFF_ROLES,
  StaffRoleCode,
} from './staff-role.constants';

export type TStaffAssignmentDTO = {
  staffBranchRoleId: number;
  peopleId: number;
  locationId: number;
  role: string;
  people?: {
    peopleId: number;
    peopleName: string | null;
    gender?: string;
    age?: number;
  };
  branch?: {
    locationId: number;
    location: string | null;
    locationCode: string | null;
    region?: string;
    country?: string | null;
  };
};

export type TStaffAssignmentRow = {
  staffBranchRoleId: number;
  peopleId: number;
  locationId: number;
  role: string;
  roleLabel: string;
  peopleName: string;
  branchLabel: string;
};

export function formatBranchLabel(branch: TStaffAssignmentDTO['branch']): string {
  if (!branch) return '';
  const name = branch.location ?? '';
  const code = branch.locationCode ?? '';
  return code ? `${name} (${code})` : name;
}

export function mapStaffAssignmentRow(dto: TStaffAssignmentDTO): TStaffAssignmentRow {
  const code = dto.role as StaffRoleCode;
  const roleLabel =
    STAFF_ROLE_LABELS[code] ?? dto.role;
  return {
    staffBranchRoleId: dto.staffBranchRoleId,
    peopleId: dto.peopleId,
    locationId: dto.locationId,
    role: dto.role,
    roleLabel,
    peopleName: dto.people?.peopleName ?? '',
    branchLabel: formatBranchLabel(dto.branch),
  };
}

export type TStaffAssignmentForm = {
  staffBranchRoleId?: number;
  peopleId: number | '';
  locationId: number | '';
  role: StaffRoleCode | '';
};

export const DEFAULT_STAFF_ASSIGNMENT: TStaffAssignmentForm = {
  staffBranchRoleId: undefined,
  peopleId: '',
  locationId: '',
  role: '',
};

export const staffAssignmentSchema = Yup.object({
  staffBranchRoleId: Yup.number().optional(),
  peopleId: Yup.number()
    .transform((v, orig) => (orig === '' || orig === undefined ? undefined : v))
    .typeError('Chọn nhân viên')
    .required('Chọn nhân viên'),
  locationId: Yup.number()
    .transform((v, orig) => (orig === '' || orig === undefined ? undefined : v))
    .typeError('Chọn chi nhánh')
    .required('Chọn chi nhánh'),
  role: Yup.string()
    .oneOf([...STAFF_ROLES], 'Chọn vai trò')
    .required('Chọn vai trò'),
});

export const STAFF_ASSIGNMENT_COLUMNS = [
  { label: 'Nhân viên', key: 'peopleName', width: 200 },
  { label: 'Chi nhánh', key: 'branchLabel', width: 260 },
  { label: 'Vai trò', key: 'roleLabel', width: 140 },
  { label: '', key: '', width: 80 },
];
