import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration giả lập 1 tháng hoạt động thực tế cho quán cà phê 24HXH (Chi nhánh Lê Lợi - Q1):
 * - Quy mô: 10 bàn (Bàn 1 -> Bàn 10)
 * - Nhân sự: 5 nhân viên (Quản lý, Trưởng ca, 2 Barista, 1 Phục vụ)
 * - Thời gian: 30 ngày gần nhất (1000+ phiên phục vụ thực tế với lượng khách biến động theo giờ cao điểm & ngày cuối tuần)
 */
export class SeedOneMonthOperationalData1734300000000 implements MigrationInterface {
  name = 'SeedOneMonthOperationalData1734300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Chuẩn hóa 10 bàn tại Chi nhánh 1 (24HXH Lê Lợi — Quận 1)
    await queryRunner.query(`
      UPDATE "cf24_coffee_table" 
      SET "location_id" = 1 
      WHERE "table_id" BETWEEN 1 AND 10;
    `);

    // 2. Chuẩn hóa 5 nhân viên tại Chi nhánh 1
    await queryRunner.query(`
      DELETE FROM "cf24_staff_branch_role" WHERE "location_id" = 1;
      
      INSERT INTO "cf24_staff_branch_role" ("staff_branch_role_id", "people_id", "location_id", "role")
      VALUES
        (101, 1, 1, 'manager'),    -- Nguyễn Thị Minh An (Quản lý)
        (102, 2, 1, 'cashier'),    -- Trần Hoàng Nam (Trưởng ca / Thu ngân)
        (103, 3, 1, 'barista'),    -- Lê Thu Hà (Trưởng nhóm Pha chế)
        (104, 4, 1, 'barista'),    -- Phạm Quốc Huy (Pha chế)
        (105, 5, 1, 'staff')       -- Hoàng Mai Linh (Phục vụ)
      ON CONFLICT ("people_id", "location_id") DO UPDATE SET "role" = EXCLUDED."role";
    `);

    // 3. Xóa các phiên cũ của chi nhánh 1 nếu có để tạo mới 1 tháng chuẩn
    await queryRunner.query(`DELETE FROM "cf24_coffee_table_session" WHERE "location_id" = 1;`);

    // 4. Tạo dữ liệu 1 tháng (30 ngày gần nhất)
    const now = new Date('2026-09-23T22:00:00+07:00');
    const sessions: Array<{ tableId: number; locationId: number; guestCount: number; openedAt: string; closedAt: string }> = [];

    // Table capacity map
    const tableCapacity: Record<number, number> = {
      1: 4, 2: 4, 3: 6, 4: 8, 5: 4, 6: 6, 7: 4, 8: 4, 9: 6, 10: 8
    };

    // Helper pseudo-random function with seed for reproducible realism
    let seed = 42;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const randomInt = (min: number, max: number) => Math.floor(random() * (max - min + 1)) + min;

    for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
      const currentDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      
      // Số lượng phiên phục vụ trong ngày (Cuối tuần đông khách hơn)
      const dailySessionCount = isWeekend ? randomInt(38, 48) : randomInt(26, 36);

      // Phân bổ các mốc giờ trong ngày (Khung giờ sáng, trưa, chiều, tối)
      for (let s = 0; s < dailySessionCount; s++) {
        const tableId = randomInt(1, 10);
        const maxCapacity = tableCapacity[tableId] || 4;
        const guestCount = randomInt(1, maxCapacity);

        // Chọn khung giờ phục vụ
        let hour = 7;
        const timeRoll = random();
        if (timeRoll < 0.35) {
          // Cao điểm Sáng (07:30 - 09:30)
          hour = 7 + random() * 2.5;
        } else if (timeRoll < 0.60) {
          // Cao điểm Trưa (11:30 - 13:30)
          hour = 11.5 + random() * 2;
        } else if (timeRoll < 0.75) {
          // Khung giờ Chiều (14:30 - 17:00)
          hour = 14.5 + random() * 2.5;
        } else {
          // Cao điểm Tối (18:30 - 21:30)
          hour = 18.5 + random() * 3;
        }

        const openedTime = new Date(currentDate);
        openedTime.setHours(Math.floor(hour), Math.floor((hour % 1) * 60), randomInt(0, 59), 0);

        // Thời gian ngồi (30 phút đến 90 phút)
        const durationMinutes = randomInt(30, 95);
        const closedTime = new Date(openedTime.getTime() + durationMinutes * 60 * 1000);

        // Không vượt quá thời điểm hiện tại
        if (openedTime > now) continue;
        const finalClosedAt = closedTime > now ? null : closedTime.toISOString();

        sessions.push({
          tableId,
          locationId: 1,
          guestCount,
          openedAt: openedTime.toISOString(),
          closedAt: finalClosedAt ? finalClosedAt : openedTime.toISOString()
        });
      }
    }

    // Sắp xếp các phiên theo thời gian mở bàn
    sessions.sort((a, b) => new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime());

    // Batch insert vào database
    const batchSize = 100;
    for (let i = 0; i < sessions.length; i += batchSize) {
      const batch = sessions.slice(i, i + batchSize);
      const valuesSql = batch
        .map(s => `(${s.tableId}, ${s.locationId}, ${s.guestCount}, '${s.openedAt}', '${s.closedAt}')`)
        .join(',\n');

      await queryRunner.query(`
        INSERT INTO "cf24_coffee_table_session" ("table_id", "location_id", "guest_count", "opened_at", "closed_at")
        VALUES ${valuesSql};
      `);
    }

    console.log(`✅ Đã sinh thành công ${sessions.length} phiên phục vụ thực tế cho 1 tháng (10 bàn, 5 nhân viên chi nhánh Q1)!`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "cf24_coffee_table_session" WHERE "location_id" = 1;`);
  }
}
