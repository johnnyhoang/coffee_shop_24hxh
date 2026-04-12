import { HolidayQueryParams, THolidayDTO } from "../types";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";


export type TUseHolidays<T> = {
  select?: (data: THolidayDTO[]) => T;
}

export const getHolidays = async ({
  queryKey,
}: {
  queryKey: [string, HolidayQueryParams];
}): Promise<THolidayDTO[]> => {
  const [, params] = queryKey;

  return axios
    .get(`holidays`, { params })
    .then((response) => response.data);
};


export const useHolidays = <T = THolidayDTO[]>({
  select,
  ...queryParams
}: TUseHolidays<T> = {}) =>
  useQuery({
    queryKey: ['holidays', { ...queryParams }],
    queryFn: getHolidays,
    select,
  });

