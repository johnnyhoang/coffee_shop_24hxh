import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * DTO cơ bản cho các tham số truy vấn
 */
export class BaseQueryParamsDto {
  /**
   * Từ khóa tìm kiếm, không bắt buộc
   * @example "keyword"
   */
  @ApiProperty({
    required: false, // Thuộc tính này không bắt buộc
    description: 'Từ khóa tìm kiếm', // Mô tả thuộc tính
  })
  @IsOptional() // Thuộc tính này không bắt buộc phải có trong yêu cầu
  @IsString() // Kiểm tra xem giá trị có phải là chuỗi
  readonly q?: string; // Từ khóa tìm kiếm, có thể không có (undefined)
}
