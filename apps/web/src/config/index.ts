import { today, getLocalTimeZone, CalendarDate } from '@internationalized/date';
const { VITE_APP_API_BASE_URL } = import.meta.env;
export const API_BASE_URL = VITE_APP_API_BASE_URL;
export const APP_CUR_DATE = today(getLocalTimeZone());
export const APP_EARLIEST_DATE = new CalendarDate(2000, 1, 1);
export const APP_LATEST_DATE = new CalendarDate(2030, 12, 31);
