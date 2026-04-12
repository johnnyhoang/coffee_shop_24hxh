import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { StaffBranchRoleService } from './staff-branch-role.service';
import { StaffBranchRole } from './staff-branch-role.entity';
import { CreateStaffBranchRoleDto } from './dto/create-staff-branch-role.dto';
import { UpdateStaffBranchRoleDto } from './dto/update-staff-branch-role.dto';
import { GetStaffBranchRolesQueryDto } from './dto/get-staff-branch-roles-query.dto';
import { MessageResult } from '@modules/common/dto';

@ApiSecurity('bearer')
@ApiTags('StaffBranchRole')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('staff-branch-roles')
export class StaffBranchRoleController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly staffBranchRoleService: StaffBranchRoleService,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Tạo phân công nhân viên — chi nhánh — vai trò',
    description:
      'Một người có thể có nhiều dòng: mỗi chi nhánh tối đa một vai trò.',
  })
  @ApiBody({ type: CreateStaffBranchRoleDto })
  create(@Body() body: CreateStaffBranchRoleDto) {
    return this.staffBranchRoleService.create(body);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Danh sách phân công (có lọc theo people / chi nhánh)' })
  @ApiOkResponse({ status: HttpStatus.OK, type: [StaffBranchRole] })
  findAll(@Query() query: GetStaffBranchRolesQueryDto) {
    return this.dataSource.transaction(async (manager) => {
      const [rows] = await this.staffBranchRoleService.findAll(query, manager);
      return rows;
    });
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({ status: HttpStatus.OK, type: StaffBranchRole })
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StaffBranchRole | NotFoundException> {
    return this.dataSource.transaction(async (manager) => {
      const row = await this.staffBranchRoleService.findById(id, manager);
      return row || new NotFoundException('Không tìm thấy phân công');
    });
  }

  @Put(':id')
  @HttpCode(200)
  @ApiBody({ type: UpdateStaffBranchRoleDto })
  @ApiOperation({ summary: 'Cập nhật vai trò hoặc đổi chi nhánh (không trùng cặp người–chi nhánh)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStaffBranchRoleDto,
  ): Promise<StaffBranchRole> {
    return this.dataSource.transaction(async (manager) => {
      const row = await this.staffBranchRoleService.findById(id, manager);
      if (!row) throw new NotFoundException('Không tìm thấy phân công');
      await this.staffBranchRoleService.update(row, body, manager);
      return await this.staffBranchRoleService.findById(id, manager);
    });
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Xóa phân công', type: StaffBranchRole })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MessageResult> {
    return this.dataSource.transaction(async (manager) => {
      await this.staffBranchRoleService.remove(id, manager);
      return { message: 'Đã xóa phân công nhân viên.' };
    });
  }
}
