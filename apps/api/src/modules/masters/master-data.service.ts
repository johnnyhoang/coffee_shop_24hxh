import { BaseService } from '@modules/common/services/base.service';
import { countByConditions } from '@modules/common/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, ObjectLiteral } from 'typeorm';
import { CreateMasterDataDto } from './dto/create-master-data.dto';
import { UpdateMasterDataDto } from './dto/update-master-data.dto';
import { MasterData } from './master-data.entity';
import { GetMasterDataQueryDto } from './dto/get-master-data-query.dto';
import { DropdownData } from '@modules/common/dto/dropdown-data.dto';

@Injectable()
export class MasterDataService extends BaseService {
  masterdataAlias = 'masterData'; // Alias for masterData table

  constructor(
    @InjectRepository(MasterData)
    private readonly repository: Repository<MasterData>,
  ) {
    super([]);
  }

  private getRepository(manager?: EntityManager): Repository<MasterData> {
    return manager ? manager.getRepository(MasterData) : this.repository;
  }

  async findById(
    dataId: number | string,
    manager?: EntityManager,
  ): Promise<MasterData> {
    const repo = this.getRepository(manager);
    const result = await repo.findOne({
      where: { dataId: +dataId },
      relations: this.relations,
    });
    if (!result) throw new NotFoundException('MasterData not found');
    return result;
  }

  async findAll(
    queryParams: GetMasterDataQueryDto,
    manager: EntityManager,
  ): Promise<[MasterData[], number]> {
    const [conditions, params] = this.buildSearchQuery(queryParams);

    // Ensure conditions is not empty before applying the .join
    const whereClause =
      conditions.length > 0 ? conditions.join(' AND ') : '1=1'; // Fallback if no conditions are present

    const orderBys = [
      { [`${this.masterdataAlias}.value`]: 'ASC' },
      { [`${this.masterdataAlias}.category`]: 'ASC' },
    ];

    let query = manager
      .createQueryBuilder(MasterData, this.masterdataAlias)
      .leftJoinAndSelect(`${this.masterdataAlias}.parentData`, 'parentData')
      .where(whereClause, params); // Use the fallback if conditions are empty

    // Add sorting conditions
    orderBys.forEach((orderBy) => {
      Object.entries(orderBy).forEach(([k, v]) => {
        query = query.addOrderBy(k, v as 'ASC' | 'DESC');
      });
    });

    return await query.getManyAndCount();
  }

  async create(
    dto: CreateMasterDataDto,
    manager?: EntityManager,
  ): Promise<MasterData> {
    const repo = this.getRepository(manager);
    const data = new MasterData(dto);
    return repo.save(data);
  }

  async count(
    conditions: ObjectLiteral,
    manager?: EntityManager,
  ): Promise<number> {
    const repo = this.getRepository(manager);
    return countByConditions(conditions, repo);
  }

  async update(
    masterData: MasterData,
    dto: UpdateMasterDataDto,
    manager: EntityManager,
  ): Promise<void> {
    const repo = this.getRepository(manager);
    const data = new MasterData({ dataId: masterData.dataId, ...dto });
    await repo.save(data);
  }

  async remove(
    dataId: number | string,
    manager?: EntityManager,
  ): Promise<MasterData> {
    const masterData = await this.findById(dataId, manager);
    return this.getRepository(manager).remove(masterData);
  }

  async findAllData(
    query: GetMasterDataQueryDto,
    manager: EntityManager,
  ): Promise<DropdownData[]> {
    const [conditions, params] = this.buildSearchQuery(query);
    const result = await manager
      .createQueryBuilder(MasterData, this.masterdataAlias)
      .leftJoinAndSelect(`${this.masterdataAlias}.parentData`, 'parentData')
      .where(conditions.join(' AND '), params)
      .getMany();
    return result.map((item) => ({
      key: item.dataId,
      value: item.value,
      label: item.category,
      group: item.parentData?.value,
    }));
  }

  async findAllCategories(manager?: EntityManager): Promise<DropdownData[]> {
    const repo = this.getRepository(manager);
    const result = await repo
      .createQueryBuilder(this.masterdataAlias)
      .select([`${this.masterdataAlias}.category`])
      .distinct()
      .getMany();

    return result.map((item) => ({
      key: item.category,
      value: item.category,
      label: item.category,
      group: item.category,
    }));
  }

  async exist(
    conditions: ObjectLiteral,
    manager: EntityManager,
  ): Promise<boolean> {
    const repo = this.getRepository(manager);
    return repo.exists(conditions);
  }

  private buildSearchQuery(
    query: GetMasterDataQueryDto,
  ): [string[], ObjectLiteral] {
    const conditions: string[] = [];
    const params: ObjectLiteral = {};

    if (query.q?.trim()) {
      const searchValues = query.q
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      const subQueries = searchValues.map(
        (value, index) =>
          `(${this.masterdataAlias}.category LIKE :search${index} OR ${this.masterdataAlias}.value LIKE :search${index} OR ${this.masterdataAlias}.codeText LIKE :search${index} OR ${this.masterdataAlias}.description LIKE :search${index})`,
      );

      conditions.push(`(${subQueries.join(' AND ')})`);
      searchValues.forEach((value, index) => {
        params[`search${index}`] = `%${value}%`;
      });
    }

    if (query.cats?.trim()) {
      conditions.push(`${this.masterdataAlias}.category IN (:...type)`);
      params.type = query.cats.split(',');
    }

    return [conditions, params];
  }
}
