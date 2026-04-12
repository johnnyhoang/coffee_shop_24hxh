import pick from 'lodash/pick';
import { THoliday, THolidayDTO } from '../types';
import dayjs from 'dayjs';

export const selectHolidays = (holidays: THolidayDTO[]): THoliday[] =>
  holidays.map((item) => ({
    ...(pick({ ...item, holiday: dayjs(item.holiday).format('DD-MMM-YY') }, [
      'holidayId',
      'holiday',
      'country',
      'holidayName',
    ]) as THoliday),
  }));
