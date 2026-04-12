import { IsInt, IsNotEmpty, IsString } from 'class-validator';

// DTO để tạo mới đối tượng Drinks
export class CreateDrinksDto {
  // Thuộc tính để lưu giới tính của người
  @IsString({ message: 'Drink Name must be a string!' }) // Kiểm tra rằng giá trị phải là chuỗi
  @IsNotEmpty({ message: 'Drink Name is required!' }) // Kiểm tra rằng giá trị không được để trống
  drinkName: string;

  // Thuộc tính để lưu tuổi của người
  @IsInt({ message: 'price must be a number!' }) // Kiểm tra rằng giá trị phải là số nguyên
  @IsNotEmpty({ message: 'price is required!' }) // Kiểm tra rằng giá trị không được để trống
  price: number | null; // Có thể là số hoặc null (nếu không có giá trị)

  // Thuộc tính để lưu tên của người
  @IsString({ message: 'Description must be a string!' }) // Kiểm tra rằng giá trị phải là chuỗi
  @IsNotEmpty({ message: 'Description is required!' }) // Kiểm tra rằng giá trị không được để trống
  description: string | null; // Có thể là chuỗi hoặc null (nếu không có giá trị)
}
