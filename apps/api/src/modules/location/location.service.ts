import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindManyOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { Location } from './location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { BaseService } from '@modules/common/services/base.service';
import { countByConditions } from '@modules/common/utils';
import { UpdateLocationDto } from './dto/update-location.dto';
import { GetLocationsQueryDto } from './dto/get-locations-query.dto';
import { LOCATION_DATA_TYPE } from '@modules/common/dto/dropdown-data.enum';
import { DropdownData } from '@modules/common/dto/dropdown-data.dto';

@Injectable()
export class LocationService extends BaseService {
  locationAlias = 'location';

  constructor(
    @InjectRepository(Location)
    private readonly repository: Repository<Location>,
  ) {
    super([]);
  }

  getRepository(manager?: EntityManager): Repository<Location> {
    return manager ? manager.getRepository(Location) : this.repository;
  }

  async findById(
    locationId: number | string,
    manager?: EntityManager,
  ): Promise<Location> {
    const repo = this.getRepository(manager);

    const result = await repo.findOne({
      where: { locationId: +locationId },
      relations: this.relations,
    });

    return result;
  }

  async findOne(
    conditions: ObjectLiteral,
    manager?: EntityManager,
  ): Promise<Location | undefined> {
    const repository = this.getRepository(manager);

    conditions.deletedAt = null;
    const entity = await repository.findOne({
      where: conditions,
      relations: this.relations,
    });

    return entity;
  }

  async findAllData(
    key: LOCATION_DATA_TYPE,
    query: GetLocationsQueryDto,
    manager: EntityManager,
  ): Promise<DropdownData[]> {
    const orderBys: Record<string, 'ASC' | 'DESC'>[] = [
      { [`${this.locationAlias}.region`]: 'ASC' },
      { [`${this.locationAlias}.country`]: 'ASC' },
      { [`${this.locationAlias}.location`]: 'ASC' },
    ];

    let searchQuery = manager.createQueryBuilder(Location, this.locationAlias);

    // Order
    orderBys.forEach((orderBy) => {
      Object.entries(orderBy).forEach(([k, v]) => {
        searchQuery = searchQuery.addOrderBy(k, v);
      });
    });

    let result = await searchQuery.getMany();

    console.log('query.regionFilter', query.regionFilter);
    if (query.regionFilter?.trim()) {
      result = result.filter((item) => item.region === query.regionFilter);
    }

    const dataMapper = {
      [LOCATION_DATA_TYPE.LOCATIONID]: (item: Location) => ({
        value: item.location,
        key: item.locationId.toString(),
        label: item.region,
      }),
      [LOCATION_DATA_TYPE.COUNTRY]: (item: Location) => ({
        value: item.country,
        key: item.country,
        label: `${item.country} - ${item.region}`,
      }),
      [LOCATION_DATA_TYPE.REGION]: (item: Location) => ({
        value: item.region,
        key: item.region,
        label: item.region,
      }),
      [LOCATION_DATA_TYPE.LOCATION]: (item: Location) => ({
        value: item.country,
        key: item.locationId.toString(),
        label: `${item.country} - ${item.region}`,
      }),
    };

    const locations = result.map(dataMapper[key]);
    // Remove duplicate locations based on the Location.value value
    return locations.filter(
      (value, index, self) =>
        self.findIndex((t) => t.value === value.value) === index,
    );
  }

  async findAll(
    query: GetLocationsQueryDto,
    manager: EntityManager,
  ): Promise<[Location[], number]> {
    const [conditions, params] = this.getLocationSearchQuery(query);

    const orderBys: Record<string, 'ASC' | 'DESC'>[] = [
      { [`${this.locationAlias}.region`]: 'ASC' },
      { [`${this.locationAlias}.country`]: 'ASC' },
      { [`${this.locationAlias}.location`]: 'ASC' },
    ];

    let searchQuery = manager
      .createQueryBuilder(Location, this.locationAlias)
      .where(conditions.join(' AND '), params);

    // Order
    orderBys.forEach((orderBy) => {
      Object.entries(orderBy).forEach(([k, v]) => {
        searchQuery = searchQuery.addOrderBy(k, v);
      });
    });

    const result = await searchQuery.getManyAndCount();

    return result;
  }

  async create(
    dto: CreateLocationDto,
    manager?: EntityManager,
  ): Promise<Location> {
    const repo: Repository<Location> = manager
      ? manager.getRepository(Location)
      : this.repository;
    const data = new Location(dto);
    return await repo.save(data);
  }

  async count(
    conditions: ObjectLiteral,
    manager?: EntityManager,
  ): Promise<number> {
    const repo = this.getRepository(manager);

    return await countByConditions(conditions, repo);
  }

  async update(
    location: Location,
    dto: UpdateLocationDto,
    manager: EntityManager,
  ): Promise<void> {
    const repo: Repository<Location> = manager
      ? manager.getRepository(Location)
      : this.repository;

    const data = new Location({
      locationId: location.locationId,
      ...dto,
    });
    await repo.save(data);
  }

  async remove(
    locationId: number | string,
    manager?: EntityManager,
  ): Promise<Location> {
    const repo: Repository<Location> = manager
      ? manager.getRepository(Location)
      : this.repository;

    // TODO: Create soft delete function
    const location = await this.findById(locationId, manager);
    if (!location) throw new NotFoundException('Location not found');
    return await repo.remove(location);
  }

  async existById(
    locationId: number,
    manager?: EntityManager,
  ): Promise<boolean> {
    const repo = this.getRepository(manager);
    const result = await repo.existsBy({ locationId });
    return result;
  }

  async exist(
    conditions: FindManyOptions<Location>,
    manager: EntityManager,
  ): Promise<boolean> {
    const repo = this.getRepository(manager);
    return await repo.exists(conditions);
  }

  private getLocationSearchQuery(
    query: GetLocationsQueryDto,
  ): [string[], ObjectLiteral] {
    const conditions: string[] = [];
    const params: ObjectLiteral = {};

    if (query.q?.trim()) {
      const subQuery = [
        `${this.locationAlias}.location LIKE :search`,
        `${this.locationAlias}.locationCode LIKE :search`,
        `${this.locationAlias}.country LIKE :search`,
        `${this.locationAlias}.region LIKE :search`,
      ];

      conditions.push(`(${subQuery.join(' OR ')})`);
      params.search = `%${query.q.trim()}%`;
    }

    if (query.regionFilter?.trim()) {
      conditions.push(`${this.locationAlias}.region IN (:...region)`);
      params.region = query.regionFilter.split(',');
    }

    return [conditions, params];
  }
}
