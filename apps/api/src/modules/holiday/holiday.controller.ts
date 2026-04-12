import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Delete,
  Request,
  Query,
  UseInterceptors,
  HttpStatus,
  Param,
  NotFoundException,
  HttpCode,
  Put,
} from '@nestjs/common';

import { Request as ExpressRequest } from 'express';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { GetHolidaysQueryDto } from './dto/get-holidays-query.dto';
import { HolidayService } from './holiday.service';
import { Holiday } from './holiday.entity';
import { HashIdDto, MessageResult } from '@modules/common/dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';

@ApiSecurity('bearer')
@Controller('holidays')
@ApiTags('Holidays')
@UseInterceptors(ClassSerializerInterceptor)
export class HolidayController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly holidayService: HolidayService,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create new Holiday',
    description: 'Create new Holiday',
  })
  @ApiBody({
    description: 'Sample request body',
    type: CreateHolidayDto,
    examples: {
      holiday: {
        value: {
          holiday: new Date('2024-12-25T00:00:00.000Z'),
          country: 'USA',
          holidayName: 'Christmas',
        } as CreateHolidayDto,
      },
    },
  })
  create(@Body() body: CreateHolidayDto) {
    return this.holidayService.create(body);
  }
  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get Holiday List',
    description: 'Get holiday list',
  })
  @ApiOkResponse({
    description: 'Get holidays successfully.',
    status: HttpStatus.OK,
    type: [Holiday],
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'application/json',
      example: {
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden resource',
      },
    },
  })
  findAll(@Request() req: ExpressRequest, @Query() query: GetHolidaysQueryDto) {
    return this.dataSource.transaction(async (manager) => {
      const [requests] = await this.holidayService.findAll(query, manager);
      return requests;
    });
  }

  @Get('/data')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get Holiday List',
    description: 'Get holiday list',
  })
  @ApiOkResponse({
    description: 'Get holidays year list.',
    status: HttpStatus.OK,
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'application/json',
      example: {
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden resource',
      },
    },
  })
  findAllData() {
    return this.dataSource.transaction(async (manager) => {
      return await this.holidayService.findAllData(manager);
    });
  }

  @Get(':hashId')
  // common data, no limit permission
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Get holiday details successfully.',
    status: HttpStatus.OK,
    type: Holiday,
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'application/json',
      example: {
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden resource',
      },
    },
  })
  public async findById(
    @Param() { hashId }: HashIdDto,
  ): Promise<Holiday | NotFoundException> {
    try {
      return this.dataSource.transaction(async (manager) => {
        const holiday = await this.holidayService.findById(hashId, manager);

        return holiday || new NotFoundException('Holiday not found');
      });
    } catch (error) {
      throw error;
    }
  }

  @Put(':hashId')
  @HttpCode(200)
  @ApiBody({
    type: UpdateHolidayDto,
  })
  @ApiOperation({ description: 'Update a holiday.' })
  @ApiOkResponse({
    description: 'A holiday successfully updated.',
    status: HttpStatus.OK,
    type: Holiday,
  })
  async update(
    @Body() body: UpdateHolidayDto,
    @Param() { hashId }: HashIdDto,
  ): Promise<Holiday> {
    return this.dataSource.transaction(async (manager) => {
      const holiday = await this.holidayService.findById(hashId, manager);

      if (!holiday) throw new NotFoundException('Holiday is not found.');

      await this.holidayService.update(holiday, body, manager);

      return await this.holidayService.findById(holiday.holidayId, manager);
    });
  }

  @Delete('/:hashId')
  @ApiOkResponse({
    description: 'Delete holiday successfully.',
    status: HttpStatus.OK,
    type: Holiday,
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'application/json',
      example: {
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden resource',
      },
    },
  })
  public async delete(@Param() { hashId }: HashIdDto): Promise<MessageResult> {
    try {
      return this.dataSource.transaction(async (manager) => {
        await this.holidayService.remove(hashId, manager);

        // TODO: Refactor
        return { message: 'Holiday has been deleted successfully.' };
      });
    } catch (error) {
      throw error;
    }
  }
}
