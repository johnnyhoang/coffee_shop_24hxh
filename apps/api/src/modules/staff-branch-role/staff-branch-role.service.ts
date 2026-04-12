import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindManyOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { StaffBranchRole } from './staff-branch-role.entity';
import { CreateStaffBranchRoleDto } from './dto/create-staff-branch-role.dto';
import { BaseService } from '@modules/common/services/base.service';
import { countByConditions } from '@modules/common/utils';
import { UpdateStaffBranchRoleDto } from './dto/update-staff-branch-role.dto';
import { GetStaffBranchRolesQueryDto } from './dto/get-staff-branch-roles-query.dto';
import { People } from '@modules/people/people.entity';
import { Location } from '@modules/location/location.entity';

@Injectable()
export class StaffBranchRoleService extends BaseService {
  sbrAlias = 'sbr';

  constructor(
    @InjectRepository(StaffBranchRole)
    private readonly repository: Repository<StaffBranchRole>,
  ) {
    super(['people', 'branch']);
  }

  getRepository(manager?: EntityManager): Repository<StaffBranchRole> {
    return manager ? manager.getRepository(StaffBranchRole) : this.repository;
  }

  async findById(
    id: number | string,
    manager?: EntityManager,
  ): Promise<StaffBranchRole> {
    const repo = this.getRepository(manager);
    return await repo.findOne({
      where: { staffBranchRoleId: +id },
      relations: this.relations,
    });
  }

  async findOne(
    conditions: ObjectLiteral,
    manager?: EntityManager,
  ): Promise<StaffBranchRole | undefined> {
    const repository = this.getRepository(manager);
    return await repository.findOne({
      where: conditions,
      relations: this.relations,
    });
  }

  async findAll(
    query: GetStaffBranchRolesQueryDto,
    manager: EntityManager,
  ): Promise<[StaffBranchRole[], number]> {
    const [conditions, params] = this.buildSearchConditions(query);

    const orderBys: Record<string, 'ASC' | 'DESC'>[] = [
      { [`branch.location`]: 'ASC' },
      { [`people.peopleName`]: 'ASC' },
    ];

    let searchQuery = manager
      .createQueryBuilder(StaffBranchRole, this.sbrAlias)
      .leftJoinAndSelect(`${this.sbrAlias}.people`, 'people')
      .leftJoinAndSelect(`${this.sbrAlias}.branch`, 'branch')
      .where(conditions.join(' AND '), params);

    orderBys.forEach((orderBy) => {
      Object.entries(orderBy).forEach(([k, v]) => {
        searchQuery = searchQuery.addOrderBy(k, v);
      });
    });

    return await searchQuery.getManyAndCount();
  }

  async create(
    dto: CreateStaffBranchRoleDto,
    manager?: EntityManager,
  ): Promise<StaffBranchRole> {
    const repo = this.getRepository(manager);
    await this.assertPeopleExists(dto.peopleId, manager);
    await this.assertLocationExists(dto.locationId, manager);
    await this.assertNoDuplicateAssignment(
      dto.peopleId,
      dto.locationId,
      undefined,
      manager,
    );

    const data = new StaffBranchRole(dto);
    return await repo.save(data);
  }

  async update(
    row: StaffBranchRole,
    dto: UpdateStaffBranchRoleDto,
    manager: EntityManager,
  ): Promise<void> {
    const repo = this.getRepository(manager);
    const nextLocationId = dto.locationId ?? row.locationId;
    const nextRole = dto.role ?? row.role;

    if (dto.locationId !== undefined && dto.locationId !== row.locationId) {
      await this.assertLocationExists(dto.locationId, manager);
    }

    await this.assertNoDuplicateAssignment(
      row.peopleId,
      nextLocationId,
      row.staffBranchRoleId,
      manager,
    );

    const data = new StaffBranchRole({
      staffBranchRoleId: row.staffBranchRoleId,
      peopleId: row.peopleId,
      locationId: nextLocationId,
      role: nextRole,
    });
    await repo.save(data);
  }

  async remove(
    id: number | string,
    manager?: EntityManager,
  ): Promise<StaffBranchRole> {
    const repo = this.getRepository(manager);
    const entity = await this.findById(id, manager);
    if (!entity) throw new NotFoundException('Không tìm thấy phân công nhân viên');
    return await repo.remove(entity);
  }

  async count(
    conditions: ObjectLiteral,
    manager?: EntityManager,
  ): Promise<number> {
    const repo = this.getRepository(manager);
    return await countByConditions(conditions, repo);
  }

  async exist(
    conditions: FindManyOptions<StaffBranchRole>,
    manager: EntityManager,
  ): Promise<boolean> {
    const repo = this.getRepository(manager);
    return await repo.exists(conditions);
  }

  private buildSearchConditions(
    query: GetStaffBranchRolesQueryDto,
  ): [string[], ObjectLiteral] {
    const conditions: string[] = ['1=1'];
    const params: ObjectLiteral = {};

    if (query.peopleId !== undefined && query.peopleId !== null) {
      conditions.push(`${this.sbrAlias}.people_id = :peopleId`);
      params.peopleId = query.peopleId;
    }

    if (query.locationId !== undefined && query.locationId !== null) {
      conditions.push(`${this.sbrAlias}.location_id = :locationId`);
      params.locationId = query.locationId;
    }

    if (query.q?.trim()) {
      conditions.push(
        `(people.fullname ILIKE :q OR people.idnumber ILIKE :q OR branch.location ILIKE :q OR branch.location_code ILIKE :q)`,
      );
      params.q = `%${query.q.trim()}%`;
    }

    return [conditions, params];
  }

  private async assertPeopleExists(
    peopleId: number,
    manager?: EntityManager,
  ): Promise<void> {
    const repo = manager
      ? manager.getRepository(People)
      : this.repository.manager.getRepository(People);
    const ok = await repo.existsBy({ peopleId });
    if (!ok) throw new NotFoundException('Không tìm thấy nhân viên (people)');
  }

  private async assertLocationExists(
    locationId: number,
    manager?: EntityManager,
  ): Promise<void> {
    const repo = manager
      ? manager.getRepository(Location)
      : this.repository.manager.getRepository(Location);
    const ok = await repo.existsBy({ locationId });
    if (!ok) throw new NotFoundException('Không tìm thấy chi nhánh (location)');
  }

  /** Không cho hai dòng trùng (cùng người + cùng chi nhánh), trừ bản ghi đang sửa */
  private async assertNoDuplicateAssignment(
    peopleId: number,
    locationId: number,
    excludeStaffBranchRoleId: number | undefined,
    manager?: EntityManager,
  ): Promise<void> {
    const repo = this.getRepository(manager);
    const qb = repo
      .createQueryBuilder(this.sbrAlias)
      .where(`${this.sbrAlias}.people_id = :peopleId`, { peopleId })
      .andWhere(`${this.sbrAlias}.location_id = :locationId`, { locationId });
    if (excludeStaffBranchRoleId !== undefined) {
      qb.andWhere(`${this.sbrAlias}.staff_branch_role_id != :excludeId`, {
        excludeId: excludeStaffBranchRoleId,
      });
    }
    const cnt = await qb.getCount();
    if (cnt > 0) {
      throw new ConflictException(
        'Nhân viên này đã có vai trò tại chi nhánh đã chọn',
      );
    }
  }
}
