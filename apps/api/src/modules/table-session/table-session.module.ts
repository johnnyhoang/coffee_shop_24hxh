import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeTable } from '@modules/coffeetable/coffeetable.entity';
import { TableSession } from './table-session.entity';
import { TableSessionService } from './table-session.service';
import { TableSessionController } from './table-session.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TableSession, CoffeeTable])],
  controllers: [TableSessionController],
  providers: [TableSessionService],
  exports: [TableSessionService],
})
export class TableSessionModule {}
