import { BaseQueryParamsDto } from '@modules/common/dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

// DTO để nhận các tham số truy vấn khi lấy danh sách người
export class GetPeoplesQueryDto extends PartialType(BaseQueryParamsDto) {
  // Hàm khởi tạo để khởi tạo đối tượng từ một phần của GetPeoplesQueryDto
  constructor(partial: Partial<GetPeoplesQueryDto>) {
    super(); // Gọi hàm khởi tạo của lớp cha (BaseQueryParamsDto)
    Object.assign(this, partial); // Gán các thuộc tính từ đối tượng partial vào đối tượng hiện tại
  }

  @ApiProperty({
    required: false, // Thuộc tính này không bắt buộc
    description: 'Sort default by: people.gender|ASC,people.age|ASC', // Mô tả về cách sắp xếp mặc định
  })
  gender?: string; // Thuộc tính để lọc theo giới tính, có thể là chuỗi hoặc không có (undefined)
}
