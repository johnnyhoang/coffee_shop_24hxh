import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindManyOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { CoffeeTable } from './coffeetable.entity';
import { CreateCoffeeTableDto } from './dto/create-coffeetable.dto';
import { BaseService } from '@modules/common/services/base.service';
import { countByConditions } from '@modules/common/utils';
import { UpdateCoffeeTableDto } from './dto/update-coffeetable.dto';
import { GetCoffeeTablesQueryDto } from './dto/get-coffeetable-query.dto';

@Injectable()
export class CoffeeTableService extends BaseService {
  // Đặt alias cho bảng CoffeeTable trong các truy vấn
  coffeetableAlias = 'coffeetable';

  constructor(
    @InjectRepository(CoffeeTable)
    private readonly repository: Repository<CoffeeTable>,
  ) {
    super([]); // Gọi constructor của lớp cơ sở với danh sách rỗng
  }

  // Lấy repository của CoffeeTable, sử dụng EntityManager nếu có, ngược lại sử dụng repository của lớp này
  getRepository(manager?: EntityManager): Repository<CoffeeTable> {
    return manager ? manager.getRepository(CoffeeTable) : this.repository;
  }

  // Tìm một bản ghi CoffeeTable theo ID
  async findById(
    coffeetableId: number | string,
    manager?: EntityManager,
  ): Promise<CoffeeTable> {
    const repo = this.getRepository(manager);

    // Tìm bản ghi trong cơ sở dữ liệu theo ID
    const result = await repo.findOne({
      where: { tableId: +coffeetableId }, // Chuyển ID sang số
      relations: this.relations, // Các quan hệ cần thiết
    });

    return result;
  }

  // Tìm một bản ghi CoffeeTable theo các điều kiện
  async findOne(
    conditions: ObjectLiteral,
    manager?: EntityManager,
  ): Promise<CoffeeTable | undefined> {
    const repository = this.getRepository(manager);

    conditions.deletedAt = null; // Chỉ tìm các bản ghi chưa bị xóa
    const entity = await repository.findOne({
      where: conditions,
      relations: this.relations,
    });

    return entity;
  }

  // Tìm tất cả các bản ghi CoffeeTable theo truy vấn
  async findAll(
    query: GetCoffeeTablesQueryDto,
    manager: EntityManager,
  ): Promise<[CoffeeTable[], number]> {
    const [conditions, params] = this.getCoffeeTableearchQuery(query);

    // Các tiêu chí sắp xếp
    const orderBys: Record<string, 'ASC' | 'DESC'>[] = [
      { [`${this.coffeetableAlias}.tableNumber`]: 'ASC' },
    ];

    const whereSql =
      conditions.length > 0 ? conditions.join(' AND ') : '1=1';

    let searchQuery = manager
      .createQueryBuilder(CoffeeTable, this.coffeetableAlias)
      .where(whereSql, params);

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

  // Tạo một bản ghi CoffeeTable mới
  async create(dto: CreateCoffeeTableDto, manager?: EntityManager): Promise<CoffeeTable> {
    const repo: Repository<CoffeeTable> = manager
      ? manager.getRepository(CoffeeTable)
      : this.repository;

    // Tạo đối tượng CoffeeTable từ DTO và lưu vào cơ sở dữ liệu
    const data = new CoffeeTable(dto);
    return await repo.save(data);
  }

  // Đếm số lượng bản ghi CoffeeTable theo điều kiện
  async count(
    conditions: ObjectLiteral,
    manager?: EntityManager,
  ): Promise<number> {
    const repo = this.getRepository(manager);

    // Sử dụng hàm countByConditions để đếm số lượng bản ghi
    return await countByConditions(conditions, repo);
  }

  // Cập nhật bản ghi CoffeeTable
  async update(
    coffeetable: CoffeeTable,
    dto: UpdateCoffeeTableDto,
    manager: EntityManager,
  ): Promise<void> {
    const repo: Repository<CoffeeTable> = manager
      ? manager.getRepository(CoffeeTable)
      : this.repository;

    // Cập nhật thông tin bản ghi và lưu vào cơ sở dữ liệu
    const data = new CoffeeTable({
        tableId: coffeetable.tableId,
      ...dto,
    });
    await repo.save(data);
  }

  // Xóa một bản ghi CoffeeTable theo ID (chưa thực hiện xóa mềm)
  async remove(
    coffeetableId: number | string,
    manager?: EntityManager,
  ): Promise<CoffeeTable> {
    const repo: Repository<CoffeeTable> = manager
      ? manager.getRepository(CoffeeTable)
      : this.repository;

    // Tìm bản ghi theo ID và xóa nếu tồn tại
    const coffeetable = await this.findById(coffeetableId, manager);
    if (!coffeetable) throw new NotFoundException('CoffeeTable not found');
    return await repo.remove(coffeetable);
  }

  // Kiểm tra xem bản ghi CoffeeTable có tồn tại theo ID không
  async existById(coffeetableId: number, manager?: EntityManager): Promise<boolean> {
    const repo = this.getRepository(manager);
    const result = await repo.existsBy({ tableId: coffeetableId });
    return result;
  }

  // Kiểm tra sự tồn tại của các bản ghi CoffeeTable theo điều kiện
  async exist(
    conditions: FindManyOptions<CoffeeTable>,
    manager: EntityManager,
  ): Promise<boolean> {
    const repo = this.getRepository(manager);
    return await repo.exists(conditions);
  }

  // Tạo truy vấn tìm kiếm CoffeeTable dựa trên DTO
  private getCoffeeTableearchQuery(
    query: GetCoffeeTablesQueryDto,
  ): [string[], ObjectLiteral] {
    const conditions: string[] = [];
    const params: ObjectLiteral = {};

    // Tìm kiếm theo chuỗi (q)
    if (query.q?.trim()) {
      const subQuery = [
        `${this.coffeetableAlias}.tableNumber LIKE :search`,
      ];

      conditions.push(`(${subQuery.join(' OR ')})`);
      params.search = `%${query.q.trim()}%`;
    }

    if (query.locationId != null) {
      conditions.push(`${this.coffeetableAlias}.location_id = :locationId`);
      params.locationId = query.locationId;
    }

    return [conditions, params];
  }
}
