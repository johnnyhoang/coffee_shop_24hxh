import { useQuery } from '@tanstack/react-query';
import { axios } from 'lib/axios';

import { DropdownItem } from 'common/types';

const getYears = async (): Promise<DropdownItem[]> => {
  return axios.get('/holidays/data');
};

export const useYears = () =>
  useQuery({
    queryKey: ['years'],
    queryFn: getYears,
  });
