import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from './holiday.entity';
import { HolidayController } from './holiday.controller';
import { HolidayService } from './holiday.service';
import { LocationModule } from '@modules/location/location.module';

@Module({
  // this module for access Holiday entity using TypeOrmModule
  imports: [TypeOrmModule.forFeature([Holiday]), LocationModule],
  controllers: [HolidayController],
  providers: [HolidayService],
})
export class HolidayModule {}
