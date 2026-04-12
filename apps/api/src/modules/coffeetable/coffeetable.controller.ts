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

import { CreateCoffeeTableDto } from './dto/create-coffeetable.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { GetCoffeeTablesQueryDto } from './dto/get-coffeetable-query.dto';
import { CoffeeTableService } from './coffeetable.service';
import { CoffeeTable } from './coffeetable.entity';
import { HashIdDto, MessageResult } from '@modules/common/dto';
import { UpdateCoffeeTableDto } from './dto/update-coffeetable.dto';

// Định nghĩa các tags cho controller
@ApiTags('CoffeeTable') // Gán tag cho controller để nhóm các API liên quan đến CoffeeTable
@UseInterceptors(ClassSerializerInterceptor) // Sử dụng interceptor để loại bỏ các thuộc tính không cần thiết khi serializing
@Controller('coffeetable') // Đặt đường dẫn cơ bản cho các endpoint là '/coffeetable'
export class CoffeeTableController {
    constructor(
        private readonly dataSource: DataSource,
        private readonly coffeeTableService: CoffeeTableService,
    ) {}

    // Endpoint để tạo mới một bản ghi CoffeeTable
    @Post()
    @HttpCode(201) // Mã trạng thái HTTP trả về là 201 Created
    @ApiOperation({
        summary: 'Create new CoffeeTable',
        description: 'Tạo mới một bản ghi CoffeeTable',
    })
    @ApiBody({
        description: 'Dữ liệu yêu cầu để tạo mới một CoffeeTable',
        type: CreateCoffeeTableDto,
        examples: {
            coffeetable: {
                value: {
                    tableNumber: 1,
                    tableStatus: true,
                    tableSize: '4',
                } satisfies CreateCoffeeTableDto,
            },
        },
    })
    create(@Body() body: CreateCoffeeTableDto) {
        return this.coffeeTableService.create(body);
    }

    // Endpoint để lấy danh sách tất cả CoffeeTable
    @Get()
    @HttpCode(200) // Mã trạng thái HTTP trả về là 200 OK
    @ApiOperation({
        summary: 'Get CoffeeTable List',
        description: 'Lấy danh sách các bản ghi CoffeeTable',
    })
    @ApiOkResponse({
        description: 'Lấy danh sách CoffeeTable thành công.',
        status: HttpStatus.OK,
        type: [CoffeeTable],
    })
    findAll(@Query() query: GetCoffeeTablesQueryDto) {
        return this.dataSource.transaction(async (manager) => {
            const [requests] = await this.coffeeTableService.findAll(query, manager);
            return requests;
        });
    }

    // Endpoint để lấy chi tiết một CoffeeTable theo hashId
    @Get(':hashId')
    @HttpCode(200) // Mã trạng thái HTTP trả về là 200 OK
    @ApiOkResponse({
        description: 'Lấy thông tin CoffeeTable thành công.',
        status: HttpStatus.OK,
        type: CoffeeTable,
    })
    public async findById(
        @Param() { hashId }: HashIdDto,
    ): Promise<CoffeeTable | NotFoundException> {
        try {
            return this.dataSource.transaction(async (manager) => {
                const coffeetable = await this.coffeeTableService.findById(hashId, manager);
                return coffeetable || new NotFoundException('CoffeeTable not found');
            });
        } catch (error) {
            throw error;
        }
    }

    // Endpoint để cập nhật thông tin một CoffeeTable theo hashId
    @Put(':hashId')
    @HttpCode(200) // Mã trạng thái HTTP trả về là 200 OK
    @ApiBody({
        type: UpdateCoffeeTableDto,
    })
    @ApiOperation({ description: 'Cập nhật thông tin một CoffeeTable.' })
    @ApiOkResponse({
        description: 'Cập nhật thông tin CoffeeTable thành công.',
        status: HttpStatus.OK,
        type: CoffeeTable,
    })
    async update(
        @Body() body: UpdateCoffeeTableDto,
        @Param() { hashId }: HashIdDto,
    ): Promise<CoffeeTable> {
        return this.dataSource.transaction(async (manager) => {
            const coffeetable = await this.coffeeTableService.findById(hashId, manager);

            if (!coffeetable) throw new NotFoundException('CoffeeTable is not found.');

            await this.coffeeTableService.update(coffeetable, body, manager);

            return await this.coffeeTableService.findById(coffeetable.tableId, manager);
        });
    }

    // Endpoint để xóa một CoffeeTable theo hashId
    @Delete('/:hashId')
    @ApiOkResponse({
        description: 'Xóa CoffeeTable thành công.',
        status: HttpStatus.OK,
        type: CoffeeTable,
    })
    public async delete(@Param() { hashId }: HashIdDto): Promise<MessageResult> {
        try {
            return this.dataSource.transaction(async (manager) => {
                await this.coffeeTableService.remove(hashId, manager);
                return { message: 'CoffeeTable has been deleted successfully.' };
            });
        } catch (error) {
            throw error;
        }
    }
}
