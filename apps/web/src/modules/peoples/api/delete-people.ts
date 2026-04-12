import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { axios } from 'lib/axios';
import { queryClient } from 'lib/react-query';

const deletePeople = (peopleId: string): Promise<void> => {
  return axios.delete(`/peoples/${peopleId}`);
};

export const useDeletePeople = () => {
  return useMutation<void, Error, string>({
    mutationFn: deletePeople,
    onSuccess: () => {
      toast.success('People deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['peoples'] });
    },
    onError: (error: Error) =>
      toast.error('Failed to remove a People: ' + error.message),
  });
};
