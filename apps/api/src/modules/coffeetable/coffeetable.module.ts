import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeTable } from './coffeetable.entity';
import { CoffeeTableController } from './coffeetable.controller';
import { CoffeeTableService } from './coffeetable.service';

@Module({
    // Nhập khẩu TypeOrmModule để làm việc với entity CoffeeTable
    imports: [TypeOrmModule.forFeature([CoffeeTable])],
    // Đăng ký controller để xử lý các yêu cầu HTTP liên quan đến CoffeeTable
    controllers: [CoffeeTableController],
    // Đăng ký service để xử lý logic nghiệp vụ liên quan đến CoffeeTable
    providers: [CoffeeTableService],
    // Xuất CoffeeTableService để có thể sử dụng ở các module khác
    exports: [CoffeeTableService],
})
export class CoffeeTableModule { }
