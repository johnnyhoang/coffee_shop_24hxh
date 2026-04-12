import { STAFF_ROLES } from '../staff-role.constants';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateStaffBranchRoleDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  locationId?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(STAFF_ROLES as unknown as string[])
  role?: string;
}
