import { DataSource, In, ObjectLiteral, Repository } from 'typeorm';
import { format } from 'date-fns';
import { validateOrReject } from 'class-validator';

export const safeKey = (() => {
  const obj = {};
  const arr = [];

  return (key) => {
    if (obj[key] !== undefined || arr[key] !== undefined) {
      return `SAFE_${key}`;
    } else {
      return key;
    }
  };
})();

export function inQueryBuilder(value: string) {
  const arrStatus = value.split(',');
  return In(arrStatus);
}

export async function cleanTable(
  dataSource: DataSource,
  tableName: string,
  _isCheckId: boolean = true,
): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();
  const quoted = `"${tableName.replace(/"/g, '""')}"`;
  await queryRunner.query(
    `TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE`,
  );
}

const tableForeignKeys: Record<string, any>[] = [];

export async function dropForeignKeys(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();
  const getTableNameQueryString = `
  SELECT table_name AS "TABLE_NAME"
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name != 'migrations'
  `;
  const tableNames = (await dataSource.query(getTableNameQueryString)).map(
    (x) => x.TABLE_NAME,
  );

  for (const tableName of tableNames) {
    const table = await queryRunner.getTable(tableName);
    if (!table) continue;
    const foreignKeys = table.foreignKeys.slice();
    if (foreignKeys.length > 0) {
      await queryRunner.dropForeignKeys(tableName, foreignKeys);
      tableForeignKeys.push({ tableName, foreignKeys });
    }
  }
}

export async function createForeignKeys(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();
  for (const tableForeignKey of tableForeignKeys) {
    const tableName = tableForeignKey.tableName;
    const foreignKeys = tableForeignKey.foreignKeys;
    if (foreignKeys.length > 0) {
      await queryRunner.createForeignKeys(tableName, foreignKeys);
    }
  }
}

export function dateTimeQuery(
  repo: Repository<any>,
  inputDate: Date,
  alias: string,
  paramAlias: string = ':date',
  condition: string = '=',
  formatStr: string = 'date',
): Record<string, any> {
  const mapFormat = {
    date: {
      postgres: {
        db: 'YYYY-MM-DD',
        js: 'yyyy-MM-dd',
      },
    },
    dateTime: {
      postgres: {
        db: 'YYYY-MM-DD HH24:MI:SS',
        js: 'yyyy-MM-dd HH:mm:ss',
      },
    },
  };

  const formatObj = mapFormat[safeKey(formatStr)]['postgres'];

  const dateParam = format(inputDate, formatObj.js);
  const dateQuery = `TO_CHAR(${alias}, '${formatObj.db}') ${condition} ${paramAlias}`;

  return {
    dateQuery,
    dateParam,
  };
}

export const countByConditions = async (
  conditions: ObjectLiteral,
  repo: Repository<any>,
) => {
  return repo.count({ where: conditions as any });
};

export const validateClass = async (
  entity: ObjectLiteral,
): Promise<string[]> => {
  try {
    await validateOrReject(entity);
    return [];
  } catch (errs: any) {
    const list = Array.isArray(errs) ? errs : [errs];
    return list.map((err) =>
      err.constraints ? Object.values(err.constraints)[0] : String(err),
    );
  }
};
