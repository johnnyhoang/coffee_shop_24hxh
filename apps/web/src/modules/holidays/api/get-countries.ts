import { useQuery } from '@tanstack/react-query';
import { axios } from 'lib/axios';

import { DropdownItem } from 'common/types';

const getCountries = async (): Promise<DropdownItem[]> => {
  return axios.get('/locations/country?orderBy=location.country|ASC');
};

export const useCountries = () =>
  useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
  });
