import {
  CalendarDate,
  CalendarDateTime,
  parseDate,
  today,
  getLocalTimeZone,
} from '@internationalized/date';

// yyyy-mm-dd   -> dd-mmm-yyyy
export function converseDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear().toString().substring(2);

  return `${day}-${month}-${year}`;
}

export function formatCalendarDate(calendarDateValue: CalendarDate): string {
  return `${calendarDateValue.day}-${calendarDateValue.month}-${calendarDateValue.year}`;
}

export function formatCalendarDateTime(
  dateTimeValue: CalendarDateTime,
): string {
  if (!dateTimeValue) return '';

  const date = new Date(dateTimeValue.toString());
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

//to local time zone from UTC
export function toLocalDateFromUTC(dateValue: Date): Date {
  const utcDate = new Date(dateValue);
  const localDate = new Date(
    utcDate.getTime() - utcDate.getTimezoneOffset() * 60000,
  );
  return localDate;
}

//for DatePicker: to local time zone from UTC
export function toLocalCalendarDateFromUTC(
  calendarDateValue: CalendarDate | string,
): CalendarDate {
  const dateValue = calendarDateValue
    ? new Date(calendarDateValue.toString())
    : new Date();
  dateValue.setMinutes(dateValue.getMinutes() - dateValue.getTimezoneOffset());
  return parseDate((dateValue.toJSON() || '').slice(0, 10));
}

export function toCalendarDateTime(
  calendarDateValue: CalendarDateTime,
): CalendarDateTime {
  const dateValue = calendarDateValue
    ? new Date(calendarDateValue.toString())
    : new Date();

  return new CalendarDateTime(
    dateValue.getFullYear(),
    dateValue.getMonth() + 1,
    dateValue.getDate(),
    dateValue.getHours(),
    dateValue.getMinutes(),
    dateValue.getSeconds(),
  );
}

export function currentDateAddYears(yearNumber: number | null): CalendarDate {
  let localDate = today(getLocalTimeZone());
  if (yearNumber) {
    localDate = localDate.add({ years: yearNumber });
  }
  return localDate;
}
