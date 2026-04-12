import { Module } from '@nestjs/common';
import { MasterDataController } from './master-data.controller';
import { MasterDataService } from './master-data.service';
import { MasterData } from './master-data.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  // Các controller trong module này
  controllers: [MasterDataController],

  // Các provider (dịch vụ) trong module này
  providers: [MasterDataService],

  // Các module khác cần được import vào module này
  imports: [
    // Kết nối với TypeORM và định nghĩa các entity mà module này sẽ sử dụng
    TypeOrmModule.forFeature([MasterData]),
  ],

  // Các provider (dịch vụ) được export để các module khác có thể sử dụng
  exports: [MasterDataService],
})
export class MasterDataModule {}
