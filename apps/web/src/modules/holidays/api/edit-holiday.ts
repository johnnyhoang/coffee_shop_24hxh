import toast from 'react-hot-toast';
import { axios } from 'lib/axios';
import { queryClient } from 'lib/react-query';
import { useMutation } from '@tanstack/react-query';

import { THoliday } from '../types';

const editHoliday = (data: THoliday) => {
  const { holidayId, ...editData } = data;
  return axios.put(`/holidays/${holidayId}`, editData);
};

export const useEditHoliday = () => {
  return useMutation({
    mutationFn: editHoliday,
    onSuccess: () => {
      toast.success('Holiday updated successfully');
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
    },
    onError: (error) =>
      toast.error('Failed to edit a Holiday: ' + error?.message),
  });
};
