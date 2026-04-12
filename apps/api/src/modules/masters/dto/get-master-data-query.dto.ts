import { BaseQueryParamsDto } from '@modules/common/dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetMasterDataQueryDto extends PartialType(BaseQueryParamsDto) {
  constructor(partial: Partial<GetMasterDataQueryDto>) {
    super();
    Object.assign(this, partial);
  }

  @ApiProperty({
    required: false,
    description: 'Category in a combine text cat1,cat2....',
  })
  @IsOptional()
  cats: string;
}
