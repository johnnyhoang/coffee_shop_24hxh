
import { number, object, string } from "yup";

export type TMasterDataDTO = {
  dataId: number;
  category: string;
  value: string;
  code: number;
  codeText: string;
  description: string;
  parentData?: TMasterDataDTO;
};

// Define the type for master data objects
export type TMasterData = {
  dataId?: number;
  category: string;
  value: string;
  code: number;
  description: string;
  parentDataId?: number;
  parentDataValue?: string;
};

// chuyển dữ liệu từ cấu trúc sang bảng phẳng
export const transformMasterData = (masterDataList: TMasterDataDTO[]): TMasterData[] => {
  return masterDataList.map(({ dataId, category, value, code, description, parentData }) => ({
    dataId,
    category,
    value,
    code,
    description,
    parentDataId: parentData?.dataId,
    parentDataValue: parentData?.value,
  }));
};


export const MASTER_DATA_COLUMNS = [
  {
    label: 'Parent Value',
    key: 'parentDataValue',
    width: 250,
  },
  {
    label: 'Category',
    key: 'category',
    width: 150,
  },
  {
    label: 'Value',
    key: 'value',
    width: 200,
  },
  {
    label: 'Code Num',
    key: 'code',
    width: 80,
  },
  {
    label: 'Description',
    key: 'description',
    width: 400,
  },
];

export const DEFAULT_MASTER_ITEM: TMasterData = {
  category: '',
  value: '',
  code: undefined,
  description: '',
  parentDataId: null,
  parentDataValue: ''
};

export const masterDataSchema = object({
  category: string().trim().required('This field is required!'),
  value: string().trim().required('This field is required!'),
  code: number().required('This field is required!'),
  parentDataId: number().notRequired(),
});
