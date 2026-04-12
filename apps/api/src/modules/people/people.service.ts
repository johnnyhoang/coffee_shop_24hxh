import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindManyOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { People } from './people.entity';
import { CreatePeopleDto } from './dto/create-people.dto';
import { BaseService } from '@modules/common/services/base.service';
import { countByConditions } from '@modules/common/utils';
import { UpdatePeopleDto } from './dto/update-people.dto';
import { GetPeoplesQueryDto } from './dto/get-peoples-query.dto';

@Injectable()
export class PeopleService extends BaseService {
  // Đặt alias cho bảng People trong các truy vấn
  peopleAlias = 'people';

  constructor(
    @InjectRepository(People)
    private readonly repository: Repository<People>,
  ) {
    super([]); // Gọi constructor của lớp cơ sở với danh sách rỗng
  }

  // Lấy repository của People, sử dụng EntityManager nếu có, ngược lại sử dụng repository của lớp này
  getRepository(manager?: EntityManager): Repository<People> {
    return manager ? manager.getRepository(People) : this.repository;
  }

  // Tìm một bản ghi People theo ID
  async findById(
    peopleId: number | string,
    manager?: EntityManager,
  ): Promise<People> {
    const repo = this.getRepository(manager);

    // Tìm bản ghi trong cơ sở dữ liệu theo ID
    const result = await repo.findOne({
      where: { peopleId: +peopleId }, // Chuyển ID sang số
      relations: this.relations, // Các quan hệ cần thiết
    });

    return result;
  }

  // Tìm một bản ghi People theo các điều kiện
  async findOne(
    conditions: ObjectLiteral,
    manager?: EntityManager,
  ): Promise<People | undefined> {
    const repository = this.getRepository(manager);

    conditions.deletedAt = null; // Chỉ tìm các bản ghi chưa bị xóa
    const entity = await repository.findOne({
      where: conditions,
      relations: this.relations,
    });

    return entity;
  }

  // Tìm tất cả các bản ghi People theo truy vấn
  async findAll(
    query: GetPeoplesQueryDto,
    manager: EntityManager,
  ): Promise<[People[], number]> {
    const [conditions, params] = this.getPeopleSearchQuery(query);

    console.log('query', JSON.stringify(query));

    // Các tiêu chí sắp xếp
    const orderBys: Record<string, 'ASC' | 'DESC'>[] = [
      { [`${this.peopleAlias}.gender`]: 'ASC' },
      { [`${this.peopleAlias}.age`]: 'ASC' },
      { [`${this.peopleAlias}.peopleName`]: 'ASC' },
    ];

    let searchQuery = manager
      .createQueryBuilder(People, this.peopleAlias)
      .where(conditions.join(' AND '), params);

    // Thêm các tiêu chí sắp xếp vào truy vấn
    orderBys.forEach((orderBy) => {
      Object.entries(orderBy).forEach(([k, v]) => {
        searchQuery = searchQuery.addOrderBy(k, v);
      });
    });

    // Thực hiện truy vấn và lấy kết quả
    const result = await searchQuery.getManyAndCount();

    return result;
  }

  // Tạo một bản ghi People mới
  async create(dto: CreatePeopleDto, manager?: EntityManager): Promise<People> {
    const repo: Repository<People> = manager
      ? manager.getRepository(People)
      : this.repository;

    // Tạo đối tượng People từ DTO và lưu vào cơ sở dữ liệu
    const data = new People(dto);
    return await repo.save(data);
  }

  // Đếm số lượng bản ghi People theo điều kiện
  async count(
    conditions: ObjectLiteral,
    manager?: EntityManager,
  ): Promise<number> {
    const repo = this.getRepository(manager);

    // Sử dụng hàm countByConditions để đếm số lượng bản ghi
    return await countByConditions(conditions, repo);
  }

  // Cập nhật bản ghi People
  async update(
    people: People,
    dto: UpdatePeopleDto,
    manager: EntityManager,
  ): Promise<void> {
    const repo: Repository<People> = manager
      ? manager.getRepository(People)
      : this.repository;

    // Cập nhật thông tin bản ghi và lưu vào cơ sở dữ liệu
    const data = new People({
      peopleId: people.peopleId,
      ...dto,
    });
    await repo.save(data);
  }

  // Xóa một bản ghi People theo ID (chưa thực hiện xóa mềm)
  async remove(
    peopleId: number | string,
    manager?: EntityManager,
  ): Promise<People> {
    const repo: Repository<People> = manager
      ? manager.getRepository(People)
      : this.repository;

    // Tìm bản ghi theo ID và xóa nếu tồn tại
    const people = await this.findById(peopleId, manager);
    if (!people) throw new NotFoundException('People not found');
    return await repo.remove(people);
  }

  // Kiểm tra xem bản ghi People có tồn tại theo ID không
  async existById(peopleId: number, manager?: EntityManager): Promise<boolean> {
    const repo = this.getRepository(manager);
    const result = await repo.existsBy({ peopleId });
    return result;
  }

  // Kiểm tra sự tồn tại của các bản ghi People theo điều kiện
  async exist(
    conditions: FindManyOptions<People>,
    manager: EntityManager,
  ): Promise<boolean> {
    const repo = this.getRepository(manager);
    return await repo.exists(conditions);
  }

  // Tạo truy vấn tìm kiếm People dựa trên DTO
  private getPeopleSearchQuery(
    query: GetPeoplesQueryDto,
  ): [string[], ObjectLiteral] {
    const conditions: string[] = [];
    const params: ObjectLiteral = {};

    // Tìm kiếm theo chuỗi (q)
    if (query.q?.trim()) {
      const subQuery = [
        `${this.peopleAlias}.peopleName LIKE :search`,
        `${this.peopleAlias}.idNumber LIKE :search`,
        `${this.peopleAlias}.age LIKE :search`,
        `${this.peopleAlias}.gender LIKE :search`,
      ];

      conditions.push(`(${subQuery.join(' OR ')})`);
      params.search = `%${query.q.trim()}%`;
    }

    // Tìm kiếm theo giới tính (gender)
    if (query.gender?.trim()) {
      conditions.push(`${this.peopleAlias}.gender IN (:...gender)`);
      params.gender = query.gender.split(',');
    }

    return [conditions, params];
  }
}
