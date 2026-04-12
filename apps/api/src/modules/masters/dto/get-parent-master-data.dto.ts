import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetParentMasterDataDto {
  /**
   * Trường này là tùy chọn cho ID của dữ liệu mà bạn muốn truy vấn.
   * Có thể là một số hoặc chuỗi, hoặc không có giá trị.
   * @example 123
   * @example '123'
   */
  @ApiProperty({
    required: false,
    description: 'ID của dữ liệu cần truy vấn.',
  })
  @IsOptional()
  dataId: number | string | null;
}
