import { ApiProperty } from '@nestjs/swagger';

export class ViewMasterDataCategoryDto {
  @ApiProperty({
    description:
      'Giá trị của danh mục, được sử dụng để đại diện cho thông tin cụ thể của danh mục.',
    example: '123',
    type: String,
  })
  value: string;

  @ApiProperty({
    description:
      'Tên của danh mục, mô tả hoặc hiển thị tên của danh mục trong giao diện người dùng.',
    example: 'Category Name',
    type: String,
  })
  name: string;
}
