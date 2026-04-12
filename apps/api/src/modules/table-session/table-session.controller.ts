import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TableSessionService } from './table-session.service';
import { CreateTableSessionDto } from './dto/create-table-session.dto';
import { UpdateTableSessionDto } from './dto/update-table-session.dto';
import { TableSession } from './table-session.entity';

@ApiTags('TableSession')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('table-sessions')
export class TableSessionController {
  constructor(private readonly tableSessionService: TableSessionService) {}

  @Get('today')
  @ApiOperation({
    summary: 'Tình hình bàn trong ngày',
    description:
      'Danh sách bàn theo chi nhánh + phiên đang mở; thống kê khách trong ngày',
  })
  getToday(@Query('locationId', ParseIntPipe) locationId: number) {
    return this.tableSessionService.getTodaySnapshot(locationId);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Nhận đơn — mở phiên',
    description: 'Ghi nhận có khách và số lượng khách tại bàn',
  })
  create(@Body() body: CreateTableSessionDto): Promise<TableSession> {
    return this.tableSessionService.createSession(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật số khách (bàn đang phục vụ)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTableSessionDto,
  ): Promise<TableSession> {
    return this.tableSessionService.updateGuestCount(id, body);
  }

  @Post(':id/close')
  @HttpCode(200)
  @ApiOperation({ summary: 'Trả bàn — đóng phiên' })
  close(@Param('id', ParseIntPipe) id: number): Promise<TableSession> {
    return this.tableSessionService.closeSession(id);
  }
}
