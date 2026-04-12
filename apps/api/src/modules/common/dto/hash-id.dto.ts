import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric } from 'class-validator';

/**
 * DTO dùng để định nghĩa cấu trúc của đối tượng chứa hash ID
 */
export class HashIdDto {
  /**
   * Thuộc tính lưu trữ hash ID
   * @example "abc123" hoặc "xyz456"
   */
  @ApiProperty({
    description: 'Hash ID để xác định đối tượng', // Mô tả thuộc tính này trong tài liệu Swagger
  })
  @IsAlphanumeric()
  readonly hashId?: string; // Thuộc tính chứa hash ID, có thể là một chuỗi alphanumeric và có thể là undefined
}
