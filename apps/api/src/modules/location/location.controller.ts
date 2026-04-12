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

import { CreateLocationDto } from './dto/create-location.dto';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { GetLocationsQueryDto } from './dto/get-locations-query.dto';
import { LocationService } from './location.service';
import { Location } from './location.entity';
import { HashIdDto, MessageResult } from '@modules/common/dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LOCATION_DATA_TYPE } from '@modules/common/dto/dropdown-data.enum';

@ApiSecurity('bearer')
@Controller('locations')
@ApiTags('Locations')
@UseInterceptors(ClassSerializerInterceptor)
export class LocationController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly locationService: LocationService,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create new Location',
    description: 'Create new Location',
  })
  @ApiBody({
    description: 'Sample request body',
    type: CreateLocationDto,
    examples: {
      location: {
        value: {
          region: 'Asia Pacific',
          country: 'Viet Nam',
          location: 'Ho Chi Minh',
          locationCode: 'HCM',
        } as CreateLocationDto,
      },
    },
  })
  create(@Body() body: CreateLocationDto) {
    return this.locationService.create(body);
  }

  @Get(':data')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get Location Data',
    description: 'Get location Data',
  })
  @ApiOkResponse({
    description: 'Get locations successfully.',
    status: HttpStatus.OK,
    type: [Location],
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'application/json',
      example: {
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden location',
      },
    },
  })
  findAllData(
    @Param('data') data: string,
    @Query() query: GetLocationsQueryDto,
  ) {
    //convert data to DropDownDataType
    return this.dataSource.transaction(async (manager) => {
      return await this.locationService.findAllData(
        LOCATION_DATA_TYPE[data.toUpperCase()],
        query,
        manager,
      );
    });
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get Location List',
    description: 'Get location list',
  })
  @ApiOkResponse({
    description: 'Get locations successfully.',
    status: HttpStatus.OK,
    type: [Location],
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'application/json',
      example: {
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden location',
      },
    },
  })
  findAll(@Query() query: GetLocationsQueryDto) {
    return this.dataSource.transaction(async (manager) => {
      const [requests] = await this.locationService.findAll(query, manager);
      return requests;
    });
  }

  @Get(':hashId')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Get location details successfully.',
    status: HttpStatus.OK,
    type: Location,
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'application/json',
      example: {
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden location',
      },
    },
  })
  public async findById(
    @Param() { hashId }: HashIdDto,
  ): Promise<Location | NotFoundException> {
    try {
      return this.dataSource.transaction(async (manager) => {
        const location = await this.locationService.findById(hashId, manager);

        return location || new NotFoundException('Location not found');
      });
    } catch (error) {
      throw error;
    }
  }

  @Put(':hashId')
  @HttpCode(200)
  @ApiBody({
    type: UpdateLocationDto,
  })
  @ApiOperation({ description: 'Update a location.' })
  @ApiOkResponse({
    description: 'A location successfully updated.',
    status: HttpStatus.OK,
    type: Location,
  })
  async update(
    @Body() body: UpdateLocationDto,
    @Param() { hashId }: HashIdDto,
  ): Promise<Location> {
    return this.dataSource.transaction(async (manager) => {
      const location = await this.locationService.findById(hashId, manager);

      if (!location) throw new NotFoundException('Location is not found.');

      await this.locationService.update(location, body, manager);

      return await this.locationService.findById(location.locationId, manager);
    });
  }

  @Delete('/:hashId')
  @ApiOkResponse({
    description: 'Delete location successfully.',
    status: HttpStatus.OK,
    type: Location,
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'application/json',
      example: {
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden location',
      },
    },
  })
  public async delete(@Param() { hashId }: HashIdDto): Promise<MessageResult> {
    try {
      return this.dataSource.transaction(async (manager) => {
        await this.locationService.remove(hashId, manager);

        // TODO: Refactor
        return { message: 'Location has been deleted successfully.' };
      });
    } catch (error) {
      throw error;
    }
  }
}
