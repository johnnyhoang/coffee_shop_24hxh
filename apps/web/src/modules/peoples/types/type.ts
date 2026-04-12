import * as Yup from 'yup';

/** Tham số lọc danh sách khách / people */
export type PeopleQueryParams = {
  q?: string;
};

// Define type for PeopleDTO (Data Transfer Object)
export type TPeopleDTO = {
  peopleId?: number;
  peopleName: string;
  age: number;
  gender: string;
  idNumber: string;
};

// Define type for People
export type TPeople = {
  peopleId?: number;
  peopleName: string;
  age: number;
  gender: string;
  idNumber: string;
};

// Function to convert an array of TPeopleDTO into TPeople
export const selectPeoples = (peoples: TPeopleDTO[]): TPeople[] =>
  peoples.map(({ peopleId, peopleName, age, gender, idNumber }) => ({
    peopleId,
    peopleName,
    age,
    gender,
    idNumber,
  }));

// Schema for validating a People object (TPeople)
export const peopleSchema = Yup.object().shape({
  peopleId: Yup.number().optional(),
  peopleName: Yup.string().required('Nhập họ tên'),
  age: Yup.number().required('Nhập tuổi'),
  gender: Yup.string().required('Nhập giới tính'),
  idNumber: Yup.string().required('Nhập số CMND/CCCD hoặc mã định danh'),
});

// Column titles for displaying people in a table format
export const PEOPLE_COLUMNS = [
  {
    label: 'Họ tên',
    key: 'peopleName',
    width: 150,
  },
  {
    label: 'Tuổi',
    key: 'age',
    width: 120,
  },
  {
    label: 'Giới tính',
    key: 'gender',
    width: 220,
  },
  {
    label: 'CMND/CCCD',
    key: 'idNumber',
    width: 220,
  },
  {
    label: '', // Empty column for additional actions (e.g., edit/delete buttons)
    key: '',
    width: 300,
  },
];

// Default values for a new People object
export const DEFAULT_PEOPLE: TPeople = {
  peopleId: null,
  peopleName: '',
  age: 10,
  gender: '',
  idNumber: '',
};
