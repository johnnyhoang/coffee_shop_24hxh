import { Optional } from '@nestjs/common';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

// DTO để tạo mới đối tượng People
export class CreatePeopleDto {
  // Thuộc tính để lưu giới tính của người
  @IsString({ message: 'Gender must be a string!' }) // Kiểm tra rằng giá trị phải là chuỗi
  @IsNotEmpty({ message: 'Gender is required!' }) // Kiểm tra rằng giá trị không được để trống
  gender: string;

  // Thuộc tính để lưu tuổi của người
  @IsInt({ message: 'Age must be a number!' }) // Kiểm tra rằng giá trị phải là số nguyên
  @IsNotEmpty({ message: 'Age is required!' }) // Kiểm tra rằng giá trị không được để trống
  age: number | null; // Có thể là số hoặc null (nếu không có giá trị)

  // Thuộc tính để lưu tên của người
  @IsString({ message: 'People must be a string!' }) // Kiểm tra rằng giá trị phải là chuỗi
  @IsNotEmpty({ message: 'People is required!' }) // Kiểm tra rằng giá trị không được để trống
  peopleName: string | null; // Có thể là chuỗi hoặc null (nếu không có giá trị)

  // Thuộc tính để lưu mã số người
  @IsString({ message: 'People Code must be a string!' }) // Kiểm tra rằng giá trị phải là chuỗi
  @Optional()
  idNumber: string | null; // Có thể là chuỗi hoặc null (nếu không có giá trị)
}
