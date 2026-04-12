// Trong file này chứa các loại thông tin sau
// Phục vụ cho Modal/Popup form
//  1 - kiểu dữ liệu để map data lấy từ Jason của API (DTO giống như backend)
//  2 - kiểu dữ liệu chuyển đổi ra để fill vào các component, có thể một số thông tin phụ sẽ được trích ra
//  3 - kiểu dữ liệu chứa thông tin để filter list
// Phục vụ cho List form
//
import { object, string, number } from "yup";

//cần giống hệt như BE json, nếu khác không sai, nhưng sẽ không có data map vào
export type TDrinkDTO = {
  drinkId: number;
  drinkName: string;
  price: number;
  description: string;
};

export type TDrink = {
  drinkId?: number | null;
  drinkName: string;
  price: number;
  description: string;
};

export const DEFAULT_DRINK: TDrink = {
  drinkId: null,
  drinkName: '',
  price: undefined,
  description: '',
};

export const transformDrinks = (peoples: TDrinkDTO[]): TDrink[] =>
  peoples.map(({ drinkId, drinkName, price, description }) => ({
    drinkId,
    drinkName,
    price,
    description,
  }));

export const drinksDataSchema = object({
  drinkName: string().trim().required('Nhập tên đồ uống'),
  price: number().required('Nhập giá'),
});

export const DRINK_COLUMNS = [
  {
    label: 'Tên đồ uống',
    key: 'drinkName',
    width: 150,
  },
  {
    label: 'Giá',
    key: 'price',
    width: 80,
  },
  {
    label: 'Mô tả',
    key: 'description',
    width: 400,
  },
];
