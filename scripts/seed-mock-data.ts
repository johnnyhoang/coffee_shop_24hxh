import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../apps/api/.env') });

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/coffee24h';

async function seedMockData() {
  console.log('🌱 Đang chạy kịch bản tạo dữ liệu giả lập 1 tháng hoạt động cho cf24 (10 bàn, 5 nhân viên)...');

  const client = new Client({ connectionString });
  await client.connect();

  try {
    // 1. Chuẩn hóa 10 bàn tại Chi nhánh 1
    await client.query(`UPDATE "cf24_coffee_table" SET "location_id" = 1 WHERE "table_id" BETWEEN 1 AND 10;`);

    // 2. Phân công 5 nhân viên
    await client.query(`DELETE FROM "cf24_staff_branch_role" WHERE "location_id" = 1;`);
    await client.query(`
      INSERT INTO "cf24_staff_branch_role" ("staff_branch_role_id", "people_id", "location_id", "role")
      VALUES
        (101, 1, 1, 'manager'),
        (102, 2, 1, 'cashier'),
        (103, 3, 1, 'barista'),
        (104, 4, 1, 'barista'),
        (105, 5, 1, 'staff')
      ON CONFLICT ("people_id", "location_id") DO UPDATE SET "role" = EXCLUDED."role";
    `);

    // 3. Xóa các phiên cũ
    await client.query(`DELETE FROM "cf24_coffee_table_session" WHERE "location_id" = 1;`);

    // 4. Sinh dữ liệu 30 ngày (1000+ phiên phục vụ)
    const now = new Date();
    const tableCapacity: Record<number, number> = { 1: 4, 2: 4, 3: 6, 4: 8, 5: 4, 6: 6, 7: 4, 8: 4, 9: 6, 10: 8 };

    let count = 0;
    for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
      const currentDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      const dailySessions = isWeekend ? 40 : 30;

      for (let s = 0; s < dailySessions; s++) {
        const tableId = (s % 10) + 1;
        const guestCount = Math.floor(Math.random() * (tableCapacity[tableId] || 4)) + 1;
        
        let hour = 7 + (s % 14);
        const openedTime = new Date(currentDate);
        openedTime.setHours(hour, Math.floor(Math.random() * 60), 0, 0);

        const durationMinutes = 35 + Math.floor(Math.random() * 50);
        const closedTime = new Date(openedTime.getTime() + durationMinutes * 60 * 1000);

        await client.query(`
          INSERT INTO "cf24_coffee_table_session" ("table_id", "location_id", "guest_count", "opened_at", "closed_at")
          VALUES ($1, 1, $2, $3, $4)
        `, [tableId, guestCount, openedTime.toISOString(), closedTime.toISOString()]);
        
        count++;
      }
    }

    console.log(`✅ Đã sinh thành công ${count} phiên phục vụ cho cf24!`);
  } catch (err) {
    console.error('❌ Lỗi khi seed dữ liệu:', err);
  } finally {
    await client.end();
  }
}

seedMockData();
