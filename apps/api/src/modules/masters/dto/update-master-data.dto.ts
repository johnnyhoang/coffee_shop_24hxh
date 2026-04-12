import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMasterDataDto {
  /**
   * ID của dữ liệu cha, là một số nguyên tùy chọn.
   * Nếu không có, trường này có thể không xuất hiện trong dữ liệu đầu vào.
   * @example 60
   */
  @IsOptional()
  @IsInt({ message: 'Parent Data must be an integer!' })
  parentDataId: number | null;

  /**
   * Giá trị của danh mục. Trường này bắt buộc và phải là một chuỗi.
   * @example 'Experience'
   */
  @IsNotEmpty({ message: 'Category value is required!' })
  @IsString({ message: 'Category must be a string!' })
  category: string;

  /**
   * Giá trị dữ liệu chính. Trường này bắt buộc và phải là một chuỗi.
   * @example '123'
   */
  @IsNotEmpty({ message: 'Master Data Value is required!' })
  @IsString({ message: 'Master Data Value must be a string!' })
  value: string;

  /**
   * Mã dữ liệu chính. Trường này bắt buộc và phải là một số nguyên.
   * @example 137
   */
  @IsNotEmpty({ message: 'Master Data Code is required!' })
  @IsInt({ message: 'Master Data Code must be an integer!' })
  code: number;

  /**
   * Văn bản mô tả mã dữ liệu chính. Trường này tùy chọn và phải là một chuỗi.
   * @example 'Expertize Communication'
   */
  @IsOptional()
  @IsString()
  codeText: string | null;

  /**
   * Mô tả chi tiết. Trường này tùy chọn và phải là một chuỗi.
   * @example 'testing 123'
   */
  @IsOptional()
  @IsString()
  description: string | null;
}
