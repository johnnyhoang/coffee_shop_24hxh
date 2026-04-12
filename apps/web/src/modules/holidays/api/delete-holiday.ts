import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { axios } from 'lib/axios';
import { queryClient } from 'lib/react-query';

const deleteHoliday = (holidayId: string) => {
  return axios.delete(`holidays/${holidayId}`);
};

export const useDeleteHoliday = () => {
  return useMutation({
    mutationFn: deleteHoliday,
    onSuccess: () => {
      toast.success('Đã xóa ngày lễ');
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
    },
    onError: (error) =>
      toast.error('Không xóa được ngày lễ: ' + error?.message),
  });
};
