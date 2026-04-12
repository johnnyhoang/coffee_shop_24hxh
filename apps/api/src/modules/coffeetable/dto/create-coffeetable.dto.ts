import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

// DTO để tạo mới đối tượng CoffeeTable
export class CreateCoffeeTableDto {
    // Thuộc tính để lưu giới tính của người
    @IsInt({ message: 'number must a number!' }) // Kiểm tra rằng giá trị phải là chuỗi
    @IsNotEmpty({ message: 'Number is required!' }) // Kiểm tra rằng giá trị không được để trống
    tableNumber: number;

    // Thuộc tính để lưu tuổi của người
    @IsBoolean({ message: 'Status must be a number!' }) // Kiểm tra rằng giá trị phải là số nguyên
    @IsNotEmpty({ message: 'Status is required!' }) // Kiểm tra rằng giá trị không được để trống
    tableStatus: boolean; // Có thể là số hoặc null (nếu không có giá trị)

    @IsOptional()
    @IsString()
    tableSize?: string | null;

    @IsOptional()
    @IsInt()
    @Min(1)
    locationId?: number | null;
}
