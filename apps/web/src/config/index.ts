import { today, getLocalTimeZone, CalendarDate } from '@internationalized/date';

/** Base URL API (khai báo trong apps/web/.env — biến VITE_*) */
export const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL as string;

/** Số ngày khóa chỉnh dữ liệu (tùy nghiệp vụ) */
export const DATA_UPDATE_LOCKED_DAYS = Number(
  import.meta.env.VITE_DATA_UPDATE_LOCKED_DAYS ?? 10000,
);
export const APP_CUR_DATE = today(getLocalTimeZone());
export const APP_EARLIEST_DATE = new CalendarDate(2000, 1, 1);
export const APP_LATEST_DATE = new CalendarDate(2030, 12, 31);
