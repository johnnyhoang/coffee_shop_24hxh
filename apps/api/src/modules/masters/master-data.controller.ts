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
  Post,
  Put,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

import { CreateMasterDataDto } from './dto/create-master-data.dto';
import { GetMasterDataQueryDto } from './dto/get-master-data-query.dto';
import { MasterData } from './master-data.entity';
import { HashIdDto, MessageResult } from '@modules/common/dto';
import { UpdateMasterDataDto } from './dto/update-master-data.dto';
import { DropdownData } from '@modules/common/dto/dropdown-data.dto';
import { MasterDataService } from './master-data.service';

@ApiTags('MasterData')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('master-data')
export class MasterDataController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly masterDataService: MasterDataService,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create new MasterData',
    description: 'Create new MasterData',
  })
  @ApiBody({
    description: 'Request body for creating new MasterData',
    type: CreateMasterDataDto,
    examples: {
      masterData: {
        value: {
          parentDataId: 60,
          codeText: 'Expertize Communication',
          code: 137,
          value: '123',
          category: 'Experience',
          description: 'testing 123',
        } as CreateMasterDataDto,
      },
    },
  })
  create(@Body() body: CreateMasterDataDto) {
    return this.masterDataService.create(body);
  }

  @Get('/data')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get Categories MasterData List',
    description: 'Fetch the list of categories in MasterData',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved categories master-data.',
    status: HttpStatus.OK,
  })
  async findAllData(
    @Query() query: GetMasterDataQueryDto,
  ): Promise<DropdownData[]> {
    return this.dataSource.transaction(async (manager) => {
      return this.masterDataService.findAllData(query, manager);
    });
  }

  @Get('/categories')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get Categories MasterData List',
    description: 'Fetch the list of all categories in MasterData',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved categories master-data.',
    status: HttpStatus.OK,
  })
  async findAllCategories(): Promise<DropdownData[]> {
    return this.dataSource.transaction(async (manager) => {
      return this.masterDataService.findAllCategories(manager);
    });
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get MasterData List',
    description: 'Fetch the list of all MasterData entries',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved master-data.',
    status: HttpStatus.OK,
    type: [MasterData],
  })
  findAll(@Request() req, @Query() queryParams: GetMasterDataQueryDto) {
    return this.dataSource.transaction(async (manager) => {
      const [requests] = await this.masterDataService.findAll(
        queryParams,
        manager,
      );
      return requests;
    });
  }

  @Get(':hashId')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Successfully retrieved masterData details.',
    status: HttpStatus.OK,
    type: MasterData,
  })
  public async findById(
    @Param() { hashId }: HashIdDto,
  ): Promise<MasterData | NotFoundException> {
    try {
      return this.dataSource.transaction(async (manager) => {
        const masterData = await this.masterDataService.findById(
          hashId,
          manager,
        );
        return masterData || new NotFoundException('MasterData not found');
      });
    } catch (error) {
      throw error;
    }
  }

  @Put(':hashId')
  @HttpCode(200)
  @ApiBody({
    type: UpdateMasterDataDto,
  })
  @ApiOperation({
    description: 'Update an existing masterData.',
  })
  @ApiOkResponse({
    description: 'Successfully updated masterData.',
    status: HttpStatus.OK,
    type: MasterData,
  })
  async update(
    @Body() body: UpdateMasterDataDto,
    @Param() { hashId }: HashIdDto,
  ): Promise<MasterData> {
    return this.dataSource.transaction(async (manager) => {
      const masterData = await this.masterDataService.findById(hashId, manager);
      if (!masterData) throw new NotFoundException('MasterData not found.');
      await this.masterDataService.update(masterData, body, manager);
      return this.masterDataService.findById(masterData.dataId, manager);
    });
  }

  @Delete('/:hashId')
  @ApiOkResponse({
    description: 'Successfully deleted masterData.',
    status: HttpStatus.OK,
    type: MasterData,
  })
  public async delete(@Param() { hashId }: HashIdDto): Promise<MessageResult> {
    try {
      return this.dataSource.transaction(async (manager) => {
        await this.masterDataService.remove(hashId, manager);
        return { message: 'MasterData has been deleted successfully.' };
      });
    } catch (error) {
      throw error;
    }
  }
}
