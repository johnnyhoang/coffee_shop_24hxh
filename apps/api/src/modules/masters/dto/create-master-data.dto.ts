import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMasterDataDto {
  /**
   * Trường này là tùy chọn cho ID dữ liệu cha, nếu có thì phải là một số nguyên.
   */
  @IsOptional()
  @IsInt({ message: 'ID dữ liệu cha phải là một số nguyên!' })
  parentDataId: number | null;

  /**
   * Trường này là bắt buộc cho danh mục, phải là một chuỗi không rỗng.
   */
  @IsNotEmpty({ message: 'Giá trị danh mục là bắt buộc!' })
  @IsString({ message: 'Danh mục phải là một chuỗi!' })
  category: string;

  /**
   * Trường này là bắt buộc cho giá trị dữ liệu chính, phải là một chuỗi không rỗng.
   */
  @IsNotEmpty({ message: 'Giá trị dữ liệu chính là bắt buộc!' })
  @IsString({ message: 'Giá trị dữ liệu chính phải là một chuỗi!' })
  value: string;

  /**
   * Trường này là bắt buộc cho mã dữ liệu chính, phải là một số nguyên.
   */
  @IsNotEmpty({ message: 'Mã dữ liệu chính là bắt buộc!' })
  @IsInt({ message: 'Mã dữ liệu chính phải là một số nguyên!' })
  code: number;

  /**
   * Trường này là tùy chọn cho văn bản mã, nếu có thì phải là một chuỗi.
   */
  @IsOptional()
  @IsString()
  codeText: string | null;

  /**
   * Trường này là tùy chọn cho mô tả, nếu có thì phải là một chuỗi.
   */
  @IsOptional()
  @IsString()
  description: string | null;
}
