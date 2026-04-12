import { STAFF_ROLES } from '../staff-role.constants';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateStaffBranchRoleDto {
  @Type(() => Number)
  @IsInt()
  peopleId: number;

  @Type(() => Number)
  @IsInt()
  locationId: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(STAFF_ROLES as unknown as string[])
  role: string;
}
