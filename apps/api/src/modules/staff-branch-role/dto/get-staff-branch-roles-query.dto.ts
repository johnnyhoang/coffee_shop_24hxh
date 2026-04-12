import { BaseQueryParamsDto } from '@modules/common/dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetStaffBranchRolesQueryDto extends PartialType(BaseQueryParamsDto) {
  constructor(partial: Partial<GetStaffBranchRolesQueryDto>) {
    super();
    Object.assign(this, partial);
  }

  @ApiProperty({ required: false, description: 'Lọc theo nhân viên (people_id)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  peopleId?: number;

  @ApiProperty({ required: false, description: 'Lọc theo chi nhánh (location_id)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  locationId?: number;
}
