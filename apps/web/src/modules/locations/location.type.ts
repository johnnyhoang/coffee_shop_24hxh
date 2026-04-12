import { DropdownItem } from "common/types";
import { object, string } from "yup";

export type TLocationDTO = {
  locationId?: number;
  location: string;
  locationCode: string;
  country: string;
  region: string;
};

export type TLocation = {
  locationId?: number;
  location: string;
  locationCode: string;
  country: string;
  region: string;
};

// Danh sách các vùng
export const regionsList: DropdownItem[] = [
  { key: 'asia-pacific', value: 'Asia Pacific', label: 'Asia Pacific', group: 'region' },
  { key: 'europe', value: 'Europe', label: 'Europe', group: 'region' },
  { key: 'north-america', value: 'North America', label: 'North America', group: 'region' },
  { key: 'south-america', value: 'South America', label: 'South America', group: 'region' },
  { key: 'africa', value: 'Africa', label: 'Africa', group: 'region' },
  { key: 'middle-east', value: 'Middle East', label: 'Middle East', group: 'region' },
];

export const transformLocations = (locations: TLocationDTO[]): TLocation[] => {
  return locations.map(
    ({ locationId, country, region, location, locationCode }) => ({
      locationId,
      country,
      region,
      location,
      locationCode,
    }),
  );
};

export const LOCATION_COLUMNS = [
  {
    label: 'Location',
    key: 'location',
    width: 150,
  },
  {
    label: 'Location Code',
    key: 'locationCode',
    width: 100,
  },
  {
    label: 'Country',
    key: 'country',
    width: 150,
  },
  {
    label: 'Region',
    key: 'region',
    width: 150,
  },
  {
    label: '',
    key: '',
    width: 300,
  },
];

export const DEFAULT_LOCATION: TLocation = {
  location: '',
  locationCode: '',
  country: '',
  region: '',
  locationId: null,
};

export const locationSchema = object({
  location: string().required('This field is required!'),
  locationCode: string().required('This field is required!'),
  country: string().required('This field is required!'),
  region: string().required('This field is required!'),
});
