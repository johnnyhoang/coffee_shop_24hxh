import { date, object, string } from 'yup';
import { THoliday } from '../types';

export const COLUMN_TITLES = [
  {
    label: 'Holiday',
    key: 'holiday',
    width: 120,
  },
  {
    label: 'Country',
    key: 'country',
    width: 150,
  },
  {
    label: 'Holiday Name',
    key: 'holidayName',
    width: 200,
  },
  {
    label: '',
    key: '',
    width: 300,
  },
];

export const DEFAULT_HOLIDAY: THoliday = {
  holiday: new Date().toISOString(),
  holidayName: '',
  country: '',
  holidayId: null,
};

export const holidaySchema = object({
  holiday: date().required('This field is required!'),
  holidayName: string().required('This field is required!'),
  country: string().required('This field is required!'),
});
