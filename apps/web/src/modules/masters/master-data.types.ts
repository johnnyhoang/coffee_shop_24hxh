
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
    label: 'Giá trị cha',
    key: 'parentDataValue',
    width: 250,
  },
  {
    label: 'Nhóm',
    key: 'category',
    width: 150,
  },
  {
    label: 'Giá trị',
    key: 'value',
    width: 200,
  },
  {
    label: 'Mã',
    key: 'code',
    width: 80,
  },
  {
    label: 'Mô tả',
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
  category: string().trim().required('Chọn nhóm'),
  value: string().trim().required('Nhập giá trị'),
  code: number().required('Nhập mã'),
  parentDataId: number().notRequired(),
});
