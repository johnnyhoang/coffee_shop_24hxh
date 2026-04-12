import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CoffeeTable } from '@modules/coffeetable/coffeetable.entity';
import { TableSession } from './table-session.entity';
import { CreateTableSessionDto } from './dto/create-table-session.dto';
import { UpdateTableSessionDto } from './dto/update-table-session.dto';

export type TableSnapshotRow = {
  table: {
    tableId: number;
    tableNumber: number;
    tableSize: string | null;
    locationId: number | null;
  };
  activeSession: {
    sessionId: number;
    guestCount: number;
    openedAt: string;
  } | null;
};

export type TodaySnapshotResult = {
  locationId: number;
  stats: {
    /** Số bàn đang có khách (phiên mở) */
    occupiedTables: number;
    /** Tổng số khách đã ghi nhận trong ngày (theo phiên đã mở trong ngày) */
    totalGuestsToday: number;
    /** Số lượt nhận đơn trong ngày (phiên đã mở, kể cả đã trả bàn) */
    visitsToday: number;
  };
  tables: TableSnapshotRow[];
};

@Injectable()
export class TableSessionService {
  constructor(
    @InjectRepository(TableSession)
    private readonly sessionRepo: Repository<TableSession>,
    @InjectRepository(CoffeeTable)
    private readonly tableRepo: Repository<CoffeeTable>,
  ) {}

  async getTodaySnapshot(locationId: number): Promise<TodaySnapshotResult> {
    const tables = await this.tableRepo.find({
      where: { locationId },
      order: { tableNumber: 'ASC' },
    });

    const activeSessions = await this.sessionRepo.find({
      where: { locationId, closedAt: IsNull() },
    });
    const byTableId = new Map(
      activeSessions.map((s) => [s.tableId, s] as const),
    );

    const statsRaw = await this.sessionRepo
      .createQueryBuilder('s')
      .select('COALESCE(SUM(s.guest_count), 0)', 'totalGuestsToday')
      .addSelect('COUNT(*)', 'visitsToday')
      .where('s.location_id = :locationId', { locationId })
      .andWhere('DATE(s.opened_at) = CURRENT_DATE')
      .getRawOne<{ totalGuestsToday: string; visitsToday: string }>();

    const totalGuestsToday = Number(statsRaw?.totalGuestsToday ?? 0);
    const visitsToday = Number(statsRaw?.visitsToday ?? 0);

    const rows: TableSnapshotRow[] = tables.map((t) => {
      const sess = byTableId.get(t.tableId);
      return {
        table: {
          tableId: t.tableId,
          tableNumber: t.tableNumber,
          tableSize: t.tableSize,
          locationId: t.locationId,
        },
        activeSession: sess
          ? {
              sessionId: sess.sessionId,
              guestCount: sess.guestCount,
              openedAt: sess.openedAt.toISOString(),
            }
          : null,
      };
    });

    return {
      locationId,
      stats: {
        occupiedTables: activeSessions.length,
        totalGuestsToday,
        visitsToday,
      },
      tables: rows,
    };
  }

  async createSession(dto: CreateTableSessionDto): Promise<TableSession> {
    const table = await this.tableRepo.findOne({
      where: { tableId: dto.tableId },
    });
    if (!table) {
      throw new NotFoundException('Không tìm thấy bàn');
    }

    const open = await this.sessionRepo.findOne({
      where: { tableId: dto.tableId, closedAt: IsNull() },
    });
    if (open) {
      throw new BadRequestException('Bàn đang có khách — không thể nhận đơn mới');
    }

    if (table.locationId == null) {
      await this.tableRepo.update(table.tableId, {
        locationId: dto.locationId,
      });
    } else if (table.locationId !== dto.locationId) {
      throw new BadRequestException('Bàn không thuộc chi nhánh đã chọn');
    }

    const now = new Date();
    const session = this.sessionRepo.create({
      tableId: dto.tableId,
      locationId: dto.locationId,
      guestCount: dto.guestCount,
      openedAt: now,
      closedAt: null,
    });
    return await this.sessionRepo.save(session);
  }

  async updateGuestCount(
    sessionId: number,
    dto: UpdateTableSessionDto,
  ): Promise<TableSession> {
    const session = await this.sessionRepo.findOne({
      where: { sessionId },
    });
    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên phục vụ');
    }
    if (session.closedAt != null) {
      throw new BadRequestException('Phiên đã đóng — không cập nhật được');
    }
    session.guestCount = dto.guestCount;
    return await this.sessionRepo.save(session);
  }

  async closeSession(sessionId: number): Promise<TableSession> {
    const session = await this.sessionRepo.findOne({
      where: { sessionId },
    });
    if (!session) {
      throw new NotFoundException('Không tìm thấy phiên phục vụ');
    }
    if (session.closedAt != null) {
      throw new BadRequestException('Bàn đã được trả');
    }
    session.closedAt = new Date();
    return await this.sessionRepo.save(session);
  }
}
