import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "lib/react-query";
import toast from "react-hot-toast";
import { TMasterData } from "./master-data.types";


const addMasterData = (data: TMasterData) => {
  const { dataId, ...addData } = data; //add thì bỏ đi ID nếu có
  return axios.post(`/master-data`, addData);
};

export const useAddMasterData = () => {
  return useMutation({
    mutationFn: addMasterData,
    onSuccess: () => {
      toast.success('Master data added successfully!');
      queryClient.invalidateQueries({ queryKey: ['master-data'] });
    },
    onError: (error) =>
      toast.error('Failed to add a Master data: ' + error?.message),
  });
};

const editMasterData = (data: TMasterData) => {
  const { dataId, parentDataValue, ...editData } = data; //phần data bỏ đi các giá trị thừa
  return axios.put(`/master-data/${dataId}`, editData);
};

export const useEditMasterData = () => {
  return useMutation({
    mutationFn: editMasterData,
    onSuccess: () => {
      toast.success('Master data updated successfully');
      queryClient.invalidateQueries({ queryKey: ['master-data'] });
    },
    onError: (error) =>
      toast.error('Failed to edit a Master data: ' + error?.message),
  });
};

const deleteMasterData = (dataId: string) => {
  return axios.delete(`/master-data/${dataId}`);
};

export const useDeleteMasterData = () => {
  return useMutation({
    mutationFn: deleteMasterData,
    onSuccess: () => {
      toast.success('Master data deteled successfully');
      queryClient.invalidateQueries({ queryKey: ['master-data'] });
    },
    onError: (error) =>
      toast.error('Failed to remove a Master data: ' + error?.message),
  });
};
