import { IsInt, IsNotEmpty, IsString } from 'class-validator';

// DTO để cập nhật thông tin của một người
export class UpdatePeopleDto {
  // Tên người
  @IsString({ message: 'People must be a string!' }) // Kiểm tra xem giá trị có phải là chuỗi không
  @IsNotEmpty({ message: 'People is required!' }) // Kiểm tra xem giá trị có rỗng không
  peopleName: string | null; // Tên người, có thể là chuỗi hoặc null

  // Giới tính
  @IsString({ message: 'Gender must be a string!' }) // Kiểm tra xem giá trị có phải là chuỗi không
  @IsNotEmpty({ message: 'Gender is required!' }) // Kiểm tra xem giá trị có rỗng không
  gender: string; // Giới tính, yêu cầu phải có giá trị không rỗng

  // Tuổi
  @IsInt({ message: 'Age must be a number!' }) // Kiểm tra xem giá trị có phải là số nguyên không
  @IsNotEmpty({ message: 'Age is required!' }) // Kiểm tra xem giá trị có rỗng không
  age: number | null; // Tuổi, có thể là số hoặc null

  // Mã số người
  @IsString({ message: 'People Code must be a string!' }) // Kiểm tra xem giá trị có phải là chuỗi không
  @IsNotEmpty({ message: 'People Code is required!' }) // Kiểm tra xem giá trị có rỗng không
  idNumber: string | null; // Mã số người, có thể là chuỗi hoặc null
}
