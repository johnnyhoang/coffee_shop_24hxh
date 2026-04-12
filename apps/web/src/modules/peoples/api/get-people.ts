import { useQuery } from '@tanstack/react-query';
import { axios } from 'lib/axios';
import { PeopleQueryParams, TPeopleDTO } from '../types/type';

export type TUsePeoples<T> = Partial<PeopleQueryParams> & {
  select?: (data: TPeopleDTO[]) => T;
};

export const getPeoples = async ({
  queryKey,
}: {
  queryKey: [string, PeopleQueryParams];
}): Promise<TPeopleDTO[]> => {
  const [, params] = queryKey;

  return axios
    .get('peoples', { params })
    .then((response) => response.data);
};

export const usePeoples = <T = TPeopleDTO[]>({
  select,
  ...queryParams
}: TUsePeoples<T> = {}) => {
  return useQuery({
    queryKey: ['peoples', queryParams], // Spreading queryParams directly
    queryFn: getPeoples,
    select,
  });
};
