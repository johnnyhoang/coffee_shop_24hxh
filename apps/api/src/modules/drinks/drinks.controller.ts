import { CreateDrinksDto } from './dto/create-drinks.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { Drinks } from './drinks.entity';
import { HashIdDto, MessageResult } from '@modules/common/dto';
import {
  Param,
  NotFoundException,
  HttpCode,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Body,
  Get,
  HttpStatus,
  Query,
  Delete,
} from '@nestjs/common';
import { DrinksService } from './drink.service';
import { GetDrinksQueryDto } from './dto/get-drinks-query.dto';
import { UpdateDrinksDto } from './dto/update-drinks.dto';

// Định nghĩa các tags cho controller
@ApiTags('Drinks') // Gán tag cho controller để nhóm các API liên quan đến Drinks
@UseInterceptors(ClassSerializerInterceptor) // Sử dụng interceptor để loại bỏ các thuộc tính không cần thiết khi serializing
@Controller('drinks') // Đặt đường dẫn cơ bản cho các endpoint là '/drinkss'
export class DrinksController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly drinksService: DrinksService,
  ) {}

  // Endpoint để tạo mới một bản ghi Drinks
  @Post()
  @HttpCode(201) // Mã trạng thái HTTP trả về là 201 Created
  @ApiOperation({
    summary: 'Create new Drinks',
    description: 'Tạo mới một bản ghi Drinks',
  })
  @ApiBody({
    description: 'Dữ liệu yêu cầu để tạo mới một Drinks',
    type: CreateDrinksDto,
    examples: {
      drinks: {
        value: {
          drinkName: 'tra dao',
          price: 22000,
          description: 'siu ngon',
        } as CreateDrinksDto,
      },
    },
  })
  create(@Body() body: CreateDrinksDto) {
    return this.drinksService.create(body);
  }

  // Endpoint để lấy danh sách tất cả Drinks
  @Get()
  @HttpCode(200) // Mã trạng thái HTTP trả về là 200 OK
  @ApiOperation({
    summary: 'Get Drinks List',
    description: 'Lấy danh sách các bản ghi Drinks',
  })
  @ApiOkResponse({
    description: 'Lấy danh sách Drinks thành công.',
    status: HttpStatus.OK,
    type: [Drinks],
  })
  findAll(@Query() query: GetDrinksQueryDto) {
    return this.dataSource.transaction(async (manager) => {
      const [requests] = await this.drinksService.findAll(query, manager);
      return requests;
    });
  }

  // Endpoint để lấy chi tiết một Drinks theo hashId
  @Get(':hashId')
  @HttpCode(200) // Mã trạng thái HTTP trả về là 200 OK
  @ApiOkResponse({
    description: 'Lấy thông tin Drinks thành công.',
    status: HttpStatus.OK,
    type: Drinks,
  })
  public async findById(
    @Param() { hashId }: HashIdDto,
  ): Promise<Drinks | NotFoundException> {
    try {
      return this.dataSource.transaction(async (manager) => {
        const drinks = await this.drinksService.findById(hashId, manager);
        return drinks || new NotFoundException('Drinks not found');
      });
    } catch (error) {
      throw error;
    }
  }

  // Endpoint để cập nhật thông tin một Drinks theo hashId
  @Put(':hashId')
  @HttpCode(200) // Mã trạng thái HTTP trả về là 200 OK
  @ApiBody({
    type: UpdateDrinksDto,
    examples: {
      drinks: {
        value: {
          drinkName: 'tra dao',
          price: 22000,
          description: 'siu ngon',
        } as CreateDrinksDto,
      },
    },
  })
  @ApiOperation({ description: 'Cập nhật thông tin một Drinks.' })
  @ApiOkResponse({
    description: 'Cập nhật thông tin Drinks thành công.',
    status: HttpStatus.OK,
    type: Drinks,
  })
  async update(
    @Body() body: UpdateDrinksDto,
    @Param() { hashId }: HashIdDto,
  ): Promise<Drinks> {
    return this.dataSource.transaction(async (manager) => {
      const drinks = await this.drinksService.findById(hashId, manager);

      if (!drinks) throw new NotFoundException('Drinks is not found.');

      await this.drinksService.update(drinks, body, manager);

      return await this.drinksService.findById(drinks.drinkId, manager);
    });
  }

  // Endpoint để xóa một Drinks theo hashId
  @Delete('/:hashId')
  @ApiOkResponse({
    description: 'Xóa Drinks thành công.',
    status: HttpStatus.OK,
    type: Drinks,
  })
  public async delete(@Param() { hashId }: HashIdDto): Promise<MessageResult> {
    try {
      return this.dataSource.transaction(async (manager) => {
        await this.drinksService.remove(hashId, manager);
        return { message: 'Drinks has been deleted successfully.' };
      });
    } catch (error) {
      throw error;
    }
  }
}
