import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { axios } from 'lib/axios';
import { queryClient } from 'lib/react-query';

const deletePeople = (peopleId: string) => {
  return axios.delete(`peoples/${peopleId}`);
};

export const useDeletePeople = () => {
  return useMutation({
    mutationFn: deletePeople,
    onSuccess: () => {
      toast.success('Đã xóa khách');
      queryClient.invalidateQueries({ queryKey: ['peoples'] });
    },
    onError: (error: Error) =>
      toast.error('Không xóa được: ' + error.message),
  });
};
