import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;
export const pool = new Pool({ connectionString: env.databaseUrl, ssl: { rejectUnauthorized: false } });
const pgSql = (sql) => sql.replace(/\?/g, (_match, offset, whole) => `$${whole.slice(0, offset).split('?').length}`);
const wrap = async (client, sql, values = []) => {
  let statement = pgSql(sql);
  if (/^\s*insert into (?!leave_balances\b)/i.test(statement) && !/\breturning\b/i.test(statement)) statement += ' RETURNING id';
  const result = await client.query(statement, values);
  const rows = result.rows;
  rows.affectedRows = result.rowCount;
  rows.insertId = result.rows[0]?.id;
  return [rows];
};
export const query = (sql, values = []) => wrap(pool, sql, values);
export async function transaction(work) {
  const connection = await pool.connect();
  try {
    await connection.query('BEGIN');
    connection.execute = (sql, values = []) => wrap(connection, sql, values);
    const result = await work(connection);
    await connection.query('COMMIT');
    return result;
  } catch (error) {
    await connection.query('ROLLBACK');
    throw error;
  } finally {
    connection.release();
  }
}
