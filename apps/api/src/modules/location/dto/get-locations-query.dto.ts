import { BaseQueryParamsDto } from '@modules/common/dto';
import { Optional } from '@nestjs/common';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetLocationsQueryDto extends PartialType(BaseQueryParamsDto) {
  constructor(partial: Partial<GetLocationsQueryDto>) {
    super();
    Object.assign(this, partial);
  }

  @ApiProperty({
    required: false,
    description: 'Sort default by: location.region|ASC,location.country|ASC',
  })
  @IsOptional()
  regionFilter?: string;
}
