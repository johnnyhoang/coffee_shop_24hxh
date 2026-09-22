import Axios from 'axios';
import { API_BASE_URL } from 'config';
import { CalendarDate } from '@internationalized/date';
import { supabase } from './supabase';

export const axios = Axios.create({
  baseURL: API_BASE_URL,
});

axios.interceptors.request.use(
  async (request) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        request.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch {
      // Non-blocking fallback
    }

    if (request.method === 'post' || request.method === 'put') {
      if (request.data) {
        for (const key in request.data) {
          if (request.data[key] instanceof Date) {
            const dateValue = request.data[key] as Date;
            if (dateValue.getHours() === 0 && dateValue.getMinutes() === 0) {
              // In case of Date only
              const utcDate = new Date(
                Date.UTC(
                  dateValue.getFullYear(),
                  dateValue.getMonth(),
                  dateValue.getDate(),
                  0,
                  0,
                  0,
                ),
              );
              request.data[key] = utcDate.toISOString(); // T00:00Z
            } else {
              // In case of DateTime
              request.data[key] = dateValue.toISOString(); // T00:00Z
            }
          } else if (request.data[key] instanceof CalendarDate) {
            // Convert local calendar date to UTC in ISO 8601 format, for example, 2021-10-10T00:00:00.000Z
            const calendarDateValue = request.data[key] as CalendarDate;

            const utcCalendarDate = new Date(
              Date.UTC(
                calendarDateValue.year,
                calendarDateValue.month - 1,
                calendarDateValue.day,
                0,
                0,
                0,
              ),
            );
            request.data[key] = utcCalendarDate.toISOString();
          }
        }
      }
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);
