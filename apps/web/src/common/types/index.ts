import { CalendarDate } from '@internationalized/date';
import { format, parseISO } from 'date-fns';

export type Option = {
  label: string;
  value: string;
};

export type DropdownItem = {
  key: string;
  value: string;
  label: string;
  group: string;
};

export type DropdownItemWithGroup = {
  group: string;
  children: DropdownItem[];
};

export type TQueryKeys<T> = {
  queryKey: [key: string, params: T];
};

export function parseDate(
  calendarDate: CalendarDate | string | null,
): CalendarDate | string | null {
  if (!calendarDate) return '';

  let date: Date;

  if (typeof calendarDate === 'string') {
    // Convert ISO string to Date object
    date = parseISO(calendarDate);
  } else {
    // Convert CalendarDate to Date object, assuming 'UTC' time zone
    date = calendarDate.toDate('UTC');
  }

  // Check if the date is before January 1, 1999
  const cutoffDate = new Date('1999-01-01');
  if (date < cutoffDate) return '';

  return format(date, 'dd-MMM-yy');
}

export function formatDuration(days: number): string {
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const daysLeft = days % 30;

  if ((years > 0 && months > 0) || daysLeft > 0) {
    let result = '';
    if (years > 0) {
      result += `${years}y${years === 1 ? '' : 's'} `;
    }
    if (months > 0) {
      result += `${months}m${months === 1 ? '' : 's'} `;
    }
    if (daysLeft > 0) {
      result += `${daysLeft}d${daysLeft === 1 ? '' : 's'}`;
    }
    return result.trim();
  } else {
    return '';
  }
}
