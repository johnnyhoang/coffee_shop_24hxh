import toast from 'react-hot-toast';
import { axios } from 'lib/axios';
import { queryClient } from 'lib/react-query';
import { useMutation } from '@tanstack/react-query';
import { TPeople } from '../types/type';

const editPeople = (data: TPeople) => {
  const { peopleId, ...editData } = data;
  return axios.put(`/peoples/${peopleId}`, editData);
};

export const useEditPeople = () => {
  return useMutation<void, Error, TPeople>({
    mutationFn: editPeople,
    onSuccess: () => {
      toast.success('People updated successfully');
      queryClient.invalidateQueries({ queryKey: ['peoples'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to edit a People: ' + error.message);
    },
  });
};
