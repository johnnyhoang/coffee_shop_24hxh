import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { axios } from 'lib/axios';
import { TDrink } from './drinks.types';
import { queryClient } from 'lib/react-query';

const addDrinks = (data: TDrink) => {
  return axios.post(`/drinks`, data);
};

export const useAddDrinks = () => {
  return useMutation({
    mutationFn: addDrinks,
    onSuccess: () => {
      toast.success('Drinks data added successfully!');
      queryClient.invalidateQueries({ queryKey: ['drinks'] });
    },
    onError: (error) => {
      toast.error('Failed to add a Drinks data: ' + error?.message);
    },
  });
};

const editDrinks = (data: TDrink) => {
  const { drinkId, ...editData } = data; //split id and info
  return axios.put(`/drinks/${drinkId}`, editData);
};

export const useEditDrinks = () => {
  return useMutation({
    mutationFn: editDrinks,
    onSuccess: () => {
      toast.success('Drinks data updated successfully');
      queryClient.invalidateQueries({ queryKey: ['drinks'] });
    },
    onError: (error) =>
      toast.error('Failed to edit a Drinks data: ' + error?.message),
  });
};

const deleteDrinks = (drinkId: string) => {
  return axios.delete(`/drinks/${drinkId}`);
};

export const useDeleteDrinks = () => {
  return useMutation({
    mutationFn: deleteDrinks,
    onSuccess: () => {
      toast.success('Drinks data deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['drinks'] });
    },
    onError: (error) => {
      toast.error('Failed to remove Drinks data: ' + error?.message);
    },
  });
};
