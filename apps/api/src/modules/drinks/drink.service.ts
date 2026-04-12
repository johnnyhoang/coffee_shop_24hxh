import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindManyOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { Drinks } from './drinks.entity';
import { CreateDrinksDto } from './dto/create-drinks.dto';
import { BaseService } from '@modules/common/services/base.service';
import { countByConditions } from '@modules/common/utils';
import { GetDrinksQueryDto } from './dto/get-drinks-query.dto';
import { UpdateDrinksDto } from './dto/update-drinks.dto';

@Injectable()
export class DrinksService extends BaseService {
  // Đặt alias cho bảng Drinks trong các truy vấn
  drinksAlias = 'drinks';

  constructor(
    @InjectRepository(Drinks)
    private readonly repository: Repository<Drinks>,
  ) {
    super([]); // Gọi constructor của lớp cơ sở với danh sách rỗng
  }

  // Lấy repository của Drinks, sử dụng EntityManager nếu có, ngược lại sử dụng repository của lớp này
  getRepository(manager?: EntityManager): Repository<Drinks> {
    return manager ? manager.getRepository(Drinks) : this.repository;
  }

  // Tìm một bản ghi Drinks theo ID
  async findById(
    drinkId: number | string,
    manager?: EntityManager,
  ): Promise<Drinks> {
    const repo = this.getRepository(manager);

    // Tìm bản ghi trong cơ sở dữ liệu theo ID
    const result = await repo.findOne({
      where: { drinkId: +drinkId }, // Chuyển ID sang số
      relations: this.relations, // Các quan hệ cần thiết
    });

    return result;
  }

  // Tìm một bản ghi Drinks theo các điều kiện
  async findOne(
    conditions: ObjectLiteral,
    manager?: EntityManager,
  ): Promise<Drinks | undefined> {
    const repository = this.getRepository(manager);

    conditions.deletedAt = null; // Chỉ tìm các bản ghi chưa bị xóa
    const entity = await repository.findOne({
      where: conditions,
      relations: this.relations,
    });

    return entity;
  }

  // Tìm tất cả các bản ghi Drinks theo truy vấn
  async findAll(
    query: GetDrinksQueryDto,
    manager: EntityManager,
  ): Promise<[Drinks[], number]> {
    const [conditions, params] = this.getDrinksSearchQuery(query);

    // Các tiêu chí sắp xếp
    const orderBys: Record<string, 'ASC' | 'DESC'>[] = [
      { [`${this.drinksAlias}.drinkName`]: 'ASC' },
    ];

    let searchQuery = manager
      .createQueryBuilder(Drinks, this.drinksAlias)
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

  // Tạo một bản ghi Drinks mới
  async create(dto: CreateDrinksDto, manager?: EntityManager): Promise<Drinks> {
    const repo: Repository<Drinks> = manager
      ? manager.getRepository(Drinks)
      : this.repository;

    // Tạo đối tượng Drinks từ DTO và lưu vào cơ sở dữ liệu
    const data = new Drinks(dto);
    return await repo.save(data);
  }

  // Đếm số lượng bản ghi Drinks theo điều kiện
  async count(
    conditions: ObjectLiteral,
    manager?: EntityManager,
  ): Promise<number> {
    const repo = this.getRepository(manager);

    // Sử dụng hàm countByConditions để đếm số lượng bản ghi
    return await countByConditions(conditions, repo);
  }

  // Cập nhật bản ghi Drinks
  async update(
    drinks: Drinks,
    dto: UpdateDrinksDto,
    manager: EntityManager,
  ): Promise<void> {
    const repo: Repository<Drinks> = manager
      ? manager.getRepository(Drinks)
      : this.repository;

    // Cập nhật thông tin bản ghi và lưu vào cơ sở dữ liệu
    const data = new Drinks({
      drinkId: drinks.drinkId,
      ...dto,
    });
    await repo.save(data);
  }

  // Xóa một bản ghi Drinks theo ID (chưa thực hiện xóa mềm)
  async remove(
    drinkId: number | string,
    manager?: EntityManager,
  ): Promise<Drinks> {
    const repo: Repository<Drinks> = manager
      ? manager.getRepository(Drinks)
      : this.repository;

    // Tìm bản ghi theo ID và xóa nếu tồn tại
    const drinks = await this.findById(drinkId, manager);
    if (!drinks) throw new NotFoundException('Drinks not found');
    return await repo.remove(drinks);
  }

  // Kiểm tra xem bản ghi Drinks có tồn tại theo ID không
  async existById(drinkId: number, manager?: EntityManager): Promise<boolean> {
    const repo = this.getRepository(manager);
    const result = await repo.existsBy({ drinkId });
    return result;
  }

  // Kiểm tra sự tồn tại của các bản ghi Drinks theo điều kiện
  async exist(
    conditions: FindManyOptions<Drinks>,
    manager: EntityManager,
  ): Promise<boolean> {
    const repo = this.getRepository(manager);
    return await repo.exists(conditions);
  }

  // Tạo truy vấn tìm kiếm Drinks dựa trên DTO
  private getDrinksSearchQuery(
    query: GetDrinksQueryDto,
  ): [string[], ObjectLiteral] {
    const conditions: string[] = [];
    const params: ObjectLiteral = {};

    // Tìm kiếm theo chuỗi (q)
    if (query.q?.trim()) {
      const subQuery = [`${this.drinksAlias}.drinkName LIKE :search`];

      conditions.push(`(${subQuery.join(' OR ')})`);
      params.search = `%${query.q.trim()}%`;
    }

    return [conditions, params];
  }
}
