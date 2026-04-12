import toast from 'react-hot-toast';
import { axios } from 'lib/axios';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'lib/react-query';
import { TPeople } from '../types/type';

const addPeople = (data: TPeople) => {
  return axios.post('peoples', data);
};

export const useAddPeople = () => {
  return useMutation({
    mutationFn: addPeople,
    onSuccess: () => {
      toast.success('Đã thêm khách');
      queryClient.invalidateQueries({ queryKey: ['peoples'] });
    },
    onError: (error: Error) =>
      toast.error('Không thêm được: ' + error.message),
  });
};
