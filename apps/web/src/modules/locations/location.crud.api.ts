import toast from 'react-hot-toast';
import { axios } from 'lib/axios';
import { useMutation } from '@tanstack/react-query';

import { TLocation } from './location.type';
import { queryClient } from '../../lib/react-query';

const addLocation = (data: TLocation) => {
  const { locationId, ...addData } = data; //add thì bỏ đi ID nếu có
  return axios.post(`/locations`, addData);
};

export const useAddLocation = () => {
  return useMutation({
    mutationFn: addLocation,
    onSuccess: () => {
      toast.success('Location added successfully');
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
    onError: (error) =>
      toast.error('Failed to add a Location: ' + error?.message),
  });
};

const deleteLocation = (locationId: string) => {
  return axios.delete(`/locations/${locationId}`);
};

export const useDeleteLocation = () => {
  return useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      toast.success('Location deleted successfully');
      queryClient.invalidateQueries({
        queryKey: ['locations'],
      });
    },
    onError: (error) =>
      toast.error('Failed to remove a Location: ' + error?.message),
  });
};

const editLocation = (data: TLocation) => {
  const { locationId, ...editData } = data; //phần data bỏ đi các giá trị thừa
  return axios.put(`/locations/${locationId}`, editData);
};

export const useEditLocation = () => {
  return useMutation({
    mutationFn: editLocation,
    onSuccess: () => {
      toast.success('Location updated successfully');
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
    onError: (error) => {
      toast.error('Failed to edit a Location: ' + error?.message);
    },
  });
};
