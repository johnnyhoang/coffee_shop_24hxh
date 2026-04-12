import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindManyOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { Holiday } from './holiday.entity';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { BaseService } from '@modules/common/services/base.service';
import { countByConditions } from '@modules/common/utils';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { GetHolidaysQueryDto } from './dto/get-holidays-query.dto';
import { DropdownData } from '@modules/common/dto/dropdown-data.dto';
import { LocationService } from '@modules/location/location.service';

@Injectable()
export class HolidayService extends BaseService {
  holidayAlias = 'holiday';

  constructor(
    @InjectRepository(Holiday) private readonly repository: Repository<Holiday>,
    private readonly locationService: LocationService,
  ) {
    super([]);
  }

  getRepository(manager?: EntityManager): Repository<Holiday> {
    return manager ? manager.getRepository(Holiday) : this.repository;
  }

  async findById(
    holidayId: number | string,
    manager?: EntityManager,
  ): Promise<Holiday> {
    const repo = this.getRepository(manager);

    const result = await repo.findOne({
      where: { holidayId: +holidayId },
      relations: this.relations,
    });

    return result;
  }

  async findOne(
    conditions: ObjectLiteral,
    manager?: EntityManager,
  ): Promise<Holiday | undefined> {
    const repository = this.getRepository(manager);

    conditions.deletedAt = null;
    const entity = await repository.findOne({
      where: conditions,
      relations: this.relations,
    });

    return entity;
  }

  async findAllData(manager: EntityManager): Promise<DropdownData[]> {
    const searchQuery = manager.createQueryBuilder(Holiday, this.holidayAlias);
    const result = await searchQuery.getMany();
    // get all holiday year from Holiday.holiday and remove duplicate year and fill to DropdownData and return it
    const years = result.map((x) => x.holiday.getFullYear());
    const uniqueYears = [...new Set(years)].sort((a, b) => a - b);
    const results = uniqueYears.map((year) => ({
      value: year.toString(),
      label: year.toString(),
      key: year.toString(),
    }));
    return results;
  }

  async findAll(
    query: GetHolidaysQueryDto,
    manager: EntityManager,
  ): Promise<[Holiday[], number]> {
    const [conditions, params] = this.getHolidaySearchQuery(query);

    console.log('query', JSON.stringify(query));

    const orderBys: Record<string, 'ASC' | 'DESC'>[] = [
      { [`${this.holidayAlias}.country`]: 'ASC' },
      { [`${this.holidayAlias}.holiday`]: 'DESC' },
    ];

    let searchQuery = manager
      .createQueryBuilder(Holiday, this.holidayAlias)
      // .innerJoinAndSelect(`${this.holidayAlias}.location`, 'location')
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
    dto: CreateHolidayDto,
    manager?: EntityManager,
  ): Promise<Holiday> {
    const repo: Repository<Holiday> = manager
      ? manager.getRepository(Holiday)
      : this.repository;
    const data = new Holiday(dto);
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
    holiday: Holiday,
    dto: UpdateHolidayDto,
    manager: EntityManager,
  ): Promise<void> {
    const repo: Repository<Holiday> = manager
      ? manager.getRepository(Holiday)
      : this.repository;
    const data = new Holiday({
      holidayId: holiday.holidayId,
      ...dto,
    });
    await repo.save(data);
  }

  async remove(
    holidayId: number | string,
    manager?: EntityManager,
  ): Promise<Holiday> {
    const repo: Repository<Holiday> = manager
      ? manager.getRepository(Holiday)
      : this.repository;
    const entity = await this.findById(holidayId, manager);
    if (!entity) throw new NotFoundException('Holiday not found');
    return await repo.remove(entity);
  }

  async exist(
    conditions: FindManyOptions<Holiday>,
    manager: EntityManager,
  ): Promise<boolean> {
    const repo = this.getRepository(manager);
    return await repo.exists(conditions);
  }

  private getHolidaySearchQuery(
    query: GetHolidaysQueryDto,
  ): [string[], ObjectLiteral] {
    const conditions: string[] = [];
    const params: ObjectLiteral = {};

    if (query.q && query.q.trim()) {
      const subQuery = [
        `${this.holidayAlias}.holidayName LIKE :search`,
        `${this.holidayAlias}.country LIKE :search`,
      ];
      conditions.push(`(${subQuery.join(' OR ')})`);
      params.search = `%${query.q.trim()}%`;
    }
    return [conditions, params];
  }
}
