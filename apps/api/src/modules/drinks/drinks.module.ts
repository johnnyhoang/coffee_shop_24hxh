import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drinks } from './drinks.entity';
import { DrinksController } from './drinks.controller';
import { DrinksService } from './drink.service';

@Module({
  // Nhập khẩu TypeOrmModule để làm việc với entity Drinks
  imports: [TypeOrmModule.forFeature([Drinks])],
  // Đăng ký controller để xử lý các yêu cầu HTTP liên quan đến Drinks
  controllers: [DrinksController],
  // Đăng ký service để xử lý logic nghiệp vụ liên quan đến Drinks
  providers: [DrinksService],
  // Xuất DrinksService để có thể sử dụng ở các module khác
  exports: [DrinksService],
})
export class DrinksModule {}
