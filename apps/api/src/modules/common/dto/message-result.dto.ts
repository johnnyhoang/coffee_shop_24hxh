import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * DTO dùng để trả kết quả thông báo từ API
 */
export class MessageResult {
  /**
   * Thuộc tính lưu trữ thông báo
   * @example "Operation successful" hoặc ["Error 1", "Error 2"]
   */
  @Expose() // Decorator từ 'class-transformer' để chỉ định thuộc tính này sẽ được xuất ra khi chuyển đổi đối tượng thành JSON
  @ApiProperty({
    description: 'Thông báo trả về', // Mô tả thuộc tính này trong tài liệu Swagger
    type: [String], // Định nghĩa kiểu dữ liệu của thuộc tính này trong tài liệu Swagger có thể là chuỗi hoặc mảng chuỗi
  })
  readonly message: string | string[]; // Thuộc tính chứa thông báo, có thể là một chuỗi hoặc mảng các chuỗi
}
