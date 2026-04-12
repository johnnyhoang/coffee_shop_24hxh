import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './people.entity';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';

@Module({
  // Nhập khẩu TypeOrmModule để làm việc với entity People
  imports: [TypeOrmModule.forFeature([People])],
  // Đăng ký controller để xử lý các yêu cầu HTTP liên quan đến People
  controllers: [PeopleController],
  // Đăng ký service để xử lý logic nghiệp vụ liên quan đến People
  providers: [PeopleService],
  // Xuất PeopleService để có thể sử dụng ở các module khác
  exports: [PeopleService],
})
export class PeopleModule {}
