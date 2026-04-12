import { date, object, string } from 'yup';
import { THoliday } from '../types';

export const COLUMN_TITLES = [
  {
    label: 'Ngày',
    key: 'holiday',
    width: 120,
  },
  {
    label: 'Quốc gia',
    key: 'country',
    width: 150,
  },
  {
    label: 'Tên ngày lễ',
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
  holiday: date().required('Chọn ngày'),
  holidayName: string().required('Nhập tên ngày lễ'),
  country: string().required('Nhập quốc gia'),
});
