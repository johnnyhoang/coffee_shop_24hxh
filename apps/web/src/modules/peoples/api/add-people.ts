import toast from 'react-hot-toast';
import { axios } from 'lib/axios';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'lib/react-query';
import { TPeople } from '../types/type';

const addPeople = (data: TPeople): Promise<TPeople> => {
  return axios.post('/peoples', data);
};

export const useAddPeople = () => {
  return useMutation<TPeople, Error, TPeople>({
    mutationFn: addPeople,
    onSuccess: () => {
      toast.success('User added successfully');
      queryClient.invalidateQueries({ queryKey: ['peoples'] });
    },
    onError: (error: Error) =>
      toast.error('Failed to add user: ' + error.message),
  });
};
