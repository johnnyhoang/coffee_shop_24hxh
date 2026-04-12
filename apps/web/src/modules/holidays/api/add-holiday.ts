import toast from 'react-hot-toast';
import { axios } from 'lib/axios';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'lib/react-query';
import { THoliday } from '../types';

const addHoliday = (data: THoliday) => {
  return axios.post('holidays', data);
};

export const useAddHoliday = () => {
  return useMutation({
    mutationFn: addHoliday,
    onSuccess: () => {
      toast.success('Đã thêm ngày lễ');
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
    },
    onError: (error) =>
      toast.error('Không thêm được ngày lễ: ' + error?.message),
  });
};
