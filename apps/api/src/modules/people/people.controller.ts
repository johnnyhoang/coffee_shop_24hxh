import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Delete,
  Query,
  UseInterceptors,
  HttpStatus,
  Param,
  NotFoundException,
  HttpCode,
  Put,
} from '@nestjs/common';

import { CreatePeopleDto } from './dto/create-people.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { GetPeoplesQueryDto } from './dto/get-peoples-query.dto';
import { PeopleService } from './people.service';
import { People } from './people.entity';
import { HashIdDto, MessageResult } from '@modules/common/dto';
import { UpdatePeopleDto } from './dto/update-people.dto';

// Định nghĩa các tags cho controller
@ApiTags('Peoples') // Gán tag cho controller để nhóm các API liên quan đến People
@UseInterceptors(ClassSerializerInterceptor) // Sử dụng interceptor để loại bỏ các thuộc tính không cần thiết khi serializing
@Controller('peoples') // Đặt đường dẫn cơ bản cho các endpoint là '/peoples'
export class PeopleController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly peopleService: PeopleService,
  ) {}

  // Endpoint để tạo mới một bản ghi People
  @Post()
  @HttpCode(201) // Mã trạng thái HTTP trả về là 201 Created
  @ApiOperation({
    summary: 'Create new People',
    description: 'Tạo mới một bản ghi People',
  })
  @ApiBody({
    description: 'Dữ liệu yêu cầu để tạo mới một People',
    type: CreatePeopleDto,
    examples: {
      people: {
        value: {
          gender: 'Male',
          age: 10,
          peopleName: 'Min Koi',
          idNumber: '09090909090',
        } as CreatePeopleDto,
      },
    },
  })
  create(@Body() body: CreatePeopleDto) {
    return this.peopleService.create(body);
  }

  // Endpoint để lấy danh sách tất cả People
  @Get()
  @HttpCode(200) // Mã trạng thái HTTP trả về là 200 OK
  @ApiOperation({
    summary: 'Get People List',
    description: 'Lấy danh sách các bản ghi People',
  })
  @ApiOkResponse({
    description: 'Lấy danh sách People thành công.',
    status: HttpStatus.OK,
    type: [People],
  })
  findAll(@Query() query: GetPeoplesQueryDto) {
    return this.dataSource.transaction(async (manager) => {
      const [requests] = await this.peopleService.findAll(query, manager);
      return requests;
    });
  }

  // Endpoint để lấy chi tiết một People theo hashId
  @Get(':hashId')
  @HttpCode(200) // Mã trạng thái HTTP trả về là 200 OK
  @ApiOkResponse({
    description: 'Lấy thông tin People thành công.',
    status: HttpStatus.OK,
    type: People,
  })
  public async findById(
    @Param() { hashId }: HashIdDto,
  ): Promise<People | NotFoundException> {
    try {
      return this.dataSource.transaction(async (manager) => {
        const people = await this.peopleService.findById(hashId, manager);
        return people || new NotFoundException('People not found');
      });
    } catch (error) {
      throw error;
    }
  }

  // Endpoint để cập nhật thông tin một People theo hashId
  @Put(':hashId')
  @HttpCode(200) // Mã trạng thái HTTP trả về là 200 OK
  @ApiBody({
    type: UpdatePeopleDto,
  })
  @ApiOperation({ description: 'Cập nhật thông tin một People.' })
  @ApiOkResponse({
    description: 'Cập nhật thông tin People thành công.',
    status: HttpStatus.OK,
    type: People,
  })
  async update(
    @Body() body: UpdatePeopleDto,
    @Param() { hashId }: HashIdDto,
  ): Promise<People> {
    return this.dataSource.transaction(async (manager) => {
      const people = await this.peopleService.findById(hashId, manager);

      if (!people) throw new NotFoundException('People is not found.');

      await this.peopleService.update(people, body, manager);

      return await this.peopleService.findById(people.peopleId, manager);
    });
  }

  // Endpoint để xóa một People theo hashId
  @Delete('/:hashId')
  @ApiOkResponse({
    description: 'Xóa People thành công.',
    status: HttpStatus.OK,
    type: People,
  })
  public async delete(@Param() { hashId }: HashIdDto): Promise<MessageResult> {
    try {
      return this.dataSource.transaction(async (manager) => {
        await this.peopleService.remove(hashId, manager);
        return { message: 'People has been deleted successfully.' };
      });
    } catch (error) {
      throw error;
    }
  }
}
