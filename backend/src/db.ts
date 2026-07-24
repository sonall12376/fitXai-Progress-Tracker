import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool(
  process.env.DATABASE_URL 
    ? { 
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required for most remote databases (Neon, Supabase)
      }
    : {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'fitaix',
        password: process.env.DB_PASSWORD || 'mohit123',
        port: parseInt(process.env.DB_PORT || '5432', 10),
      }
);

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};
