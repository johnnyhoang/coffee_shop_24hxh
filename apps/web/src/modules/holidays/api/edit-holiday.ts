import toast from 'react-hot-toast';
import { axios } from 'lib/axios';
import { queryClient } from 'lib/react-query';
import { useMutation } from '@tanstack/react-query';

import { THoliday } from '../types';

const editHoliday = (data: THoliday) => {
  const { holidayId, ...editData } = data;
  return axios.put(`holidays/${holidayId}`, editData);
};

export const useEditHoliday = () => {
  return useMutation({
    mutationFn: editHoliday,
    onSuccess: () => {
      toast.success('Đã cập nhật ngày lễ');
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
    },
    onError: (error) =>
      toast.error('Không cập nhật được ngày lễ: ' + error?.message),
  });
};
