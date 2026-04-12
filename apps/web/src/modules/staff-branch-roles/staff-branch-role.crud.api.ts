import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { axios } from 'lib/axios';
import { queryClient } from 'lib/react-query';
import { TStaffAssignmentForm } from './staff-assignment.types';

const invalidate = () => {
  queryClient.invalidateQueries({ queryKey: ['staff-branch-roles'] });
};

export const useAddStaffAssignment = () => {
  return useMutation({
    mutationFn: (data: Pick<TStaffAssignmentForm, 'peopleId' | 'locationId' | 'role'>) =>
      axios.post('/staff-branch-roles', {
        peopleId: data.peopleId,
        locationId: data.locationId,
        role: data.role,
      }),
    onSuccess: () => {
      toast.success('Đã thêm phân công');
      invalidate();
    },
    onError: (error: Error & { message?: string }) => {
      toast.error(error?.message ?? 'Không thêm được phân công');
    },
  });
};

export const useEditStaffAssignment = () => {
  return useMutation({
    mutationFn: (payload: {
      staffBranchRoleId: number;
      locationId?: number;
      role?: string;
    }) =>
      axios.put(`/staff-branch-roles/${payload.staffBranchRoleId}`, {
        ...(payload.locationId !== undefined ? { locationId: payload.locationId } : {}),
        ...(payload.role !== undefined ? { role: payload.role } : {}),
      }),
    onSuccess: () => {
      toast.success('Đã cập nhật phân công');
      invalidate();
    },
    onError: (error: Error & { message?: string }) => {
      toast.error(error?.message ?? 'Không cập nhật được');
    },
  });
};

export const useDeleteStaffAssignment = () => {
  return useMutation({
    mutationFn: (staffBranchRoleId: number) =>
      axios.delete(`/staff-branch-roles/${staffBranchRoleId}`),
    onSuccess: () => {
      toast.success('Đã xóa phân công');
      invalidate();
    },
    onError: (error: Error & { message?: string }) => {
      toast.error(error?.message ?? 'Không xóa được');
    },
  });
};
