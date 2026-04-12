
export type THoliday = {
  holidayId?: number;
  holiday: string;
  country: string;
  holidayName: string;
};

export type THolidayDTO = {
  holidayId?: number;
  holiday: string;
  country: string;
  holidayName: string;
};

export type HolidayQueryParams =
  Partial<{
    country?: string;
    years?: string;
  }>;
