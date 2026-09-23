import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../apps/api/.env') });

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/coffee24h';

async function cleanDatabase() {
  console.log('🧹 Đang dọn dẹp các phiên hoạt động thử nghiệm của cf24...');
  const client = new Client({ connectionString });
  await client.connect();

  try {
    await client.query(`DELETE FROM "cf24_coffee_table_session" WHERE "location_id" = 1;`);
    console.log('✨ Đã làm sạch dữ liệu hoạt động cho chi nhánh cf24!');
  } catch (err) {
    console.error('❌ Lỗi dọn dẹp database:', err);
  } finally {
    await client.end();
  }
}

cleanDatabase();
