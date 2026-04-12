import { ApiProperty } from '@nestjs/swagger';

export class ViewParentDataCategoryDto {
  @ApiProperty({
    description:
      'Tên của danh mục cha, thường được sử dụng để hiển thị hoặc mô tả danh mục trong giao diện người dùng.',
    example: 'Parent Category Name',
    type: String,
  })
  name: string;

  @ApiProperty({
    description:
      'Giá trị của danh mục cha, có thể là một số hoặc null nếu không có giá trị cụ thể.',
    example: 123,
    type: Number,
    nullable: true,
  })
  value: number | null;
}
