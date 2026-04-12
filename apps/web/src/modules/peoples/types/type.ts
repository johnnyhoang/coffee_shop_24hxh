import * as Yup from 'yup';

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
  peopleId: Yup.number().optional(), // Optional field (not always present)
  peopleName: Yup.string().required('People Name is required!'),
  age: Yup.number().required('Age is required!'),
  gender: Yup.string().required('Gender is required!'),
  idNumber: Yup.string().required('ID Number is required!'),
});

// Column titles for displaying people in a table format
export const PEOPLE_COLUMNS = [
  {
    label: 'People Name',
    key: 'peopleName',
    width: 150,
  },
  {
    label: 'Ages',
    key: 'age',
    width: 120,
  },
  {
    label: 'Gender',
    key: 'gender',
    width: 220,
  },
  {
    label: 'ID Number',
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
