import { today, getLocalTimeZone, CalendarDate } from '@internationalized/date';

/**
 * Base URL API (apps/web/.env — VITE_APP_API_BASE_URL).
 * Mặc định trùng cổng API Nest (PORT trong apps/api, thường 3000).
 * Không dùng dấu / ở cuối; path gọi axios không bắt đầu bằng / để giữ prefix /api/v1.
 */
export const API_BASE_URL =
  (import.meta.env.VITE_APP_API_BASE_URL as string) ||
  'http://localhost:3000/api/v1';

/** Số ngày khóa chỉnh dữ liệu (tùy nghiệp vụ) */
export const DATA_UPDATE_LOCKED_DAYS = Number(
  import.meta.env.VITE_DATA_UPDATE_LOCKED_DAYS ?? 10000,
);
export const APP_CUR_DATE = today(getLocalTimeZone());
export const APP_EARLIEST_DATE = new CalendarDate(2000, 1, 1);
export const APP_LATEST_DATE = new CalendarDate(2030, 12, 31);
