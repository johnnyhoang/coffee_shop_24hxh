import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class UpdateTableSessionDto {
  @ApiProperty({ description: 'Cập nhật số khách khi bàn vẫn đang phục vụ' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  guestCount: number;
}
