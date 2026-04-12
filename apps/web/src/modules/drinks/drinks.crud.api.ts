import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { axios } from 'lib/axios';
import { TDrink } from './drinks.types';
import { queryClient } from 'lib/react-query';

const addDrinks = (data: TDrink) => {
  return axios.post('drinks', data);
};

export const useAddDrinks = () => {
  return useMutation({
    mutationFn: addDrinks,
    onSuccess: () => {
      toast.success('Đã thêm đồ uống');
      queryClient.invalidateQueries({ queryKey: ['drinks'] });
    },
    onError: (error) => {
      toast.error('Không thêm được đồ uống: ' + error?.message);
    },
  });
};

const editDrinks = (data: TDrink) => {
  const { drinkId, ...editData } = data; //split id and info
  return axios.put(`drinks/${drinkId}`, editData);
};

export const useEditDrinks = () => {
  return useMutation({
    mutationFn: editDrinks,
    onSuccess: () => {
      toast.success('Đã cập nhật đồ uống');
      queryClient.invalidateQueries({ queryKey: ['drinks'] });
    },
    onError: (error) =>
      toast.error('Không cập nhật được đồ uống: ' + error?.message),
  });
};

const deleteDrinks = (drinkId: string) => {
  return axios.delete(`drinks/${drinkId}`);
};

export const useDeleteDrinks = () => {
  return useMutation({
    mutationFn: deleteDrinks,
    onSuccess: () => {
      toast.success('Đã xóa đồ uống');
      queryClient.invalidateQueries({ queryKey: ['drinks'] });
    },
    onError: (error) => {
      toast.error('Không xóa được đồ uống: ' + error?.message);
    },
  });
};
