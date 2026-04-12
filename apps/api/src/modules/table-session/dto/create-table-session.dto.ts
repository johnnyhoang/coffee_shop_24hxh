import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

/** Nhận đơn — mở phiên phục vụ, ghi nhận số khách */
export class CreateTableSessionDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  tableId: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  locationId: number;

  @ApiProperty({ description: 'Số khách tại bàn' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  guestCount: number;
}
