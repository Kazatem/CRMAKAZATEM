import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/crmakazatem';

export const pool = new Pool({ connectionString });

export async function query(text: string, params?: unknown[]) {
  return pool.query(text, params);
}

export async function closePool() {
  await pool.end();
}
