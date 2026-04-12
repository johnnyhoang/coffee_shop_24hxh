import { useQuery } from '@tanstack/react-query';
import { axios } from 'lib/axios';

import { DropdownItem } from 'common/types';

const getCountries = async (): Promise<DropdownItem[]> => {
  const { data } = await axios.get('locations/country', {
    params: { orderBy: 'location.country|ASC' },
  });
  return data;
};

export const useCountries = () =>
  useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
  });
