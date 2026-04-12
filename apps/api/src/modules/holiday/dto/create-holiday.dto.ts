import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateHolidayDto {
  @IsNotEmpty({ message: 'Holiday Date is required!' })
  @IsDate({ message: 'Holiday Date must be a valid date!' })
  @Type(() => Date)
  holiday: Date;

  @IsNotEmpty({ message: 'Country is required!' })
  @IsString({ message: 'Country must be a string!' })
  country: string;

  @IsNotEmpty({ message: 'Holiday Name is required!' })
  @IsString({ message: 'Holiday Name must be a string!' })
  holidayName: string | null;
}
