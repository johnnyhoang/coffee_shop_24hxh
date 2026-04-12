import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateLocationDto {
  @IsString({ message: 'Region must be a string!' })
  @IsNotEmpty({ message: 'Region is required!' })
  region: string;

  @IsString({ message: 'Country must be a string!' })
  @IsNotEmpty({ message: 'Country is required!' })
  country: string | null;

  @IsString({ message: 'Location must be a string!' })
  @IsNotEmpty({ message: 'Location is required!' })
  location: string | null;

  @IsString({ message: 'Location Code must be a string!' })
  @IsNotEmpty({ message: 'Location Code is required!' })
  locationCode: string | null;
}
