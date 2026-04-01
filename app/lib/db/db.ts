import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL + "&sslmode=verify-full",
  ssl: { rejectUnauthorized: false },
});