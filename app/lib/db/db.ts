// db.js
import mysql from 'mysql2/promise';

// 建立連線池
export const pool = mysql.createPool({
  host: process.env.DB_HOST,       // 可以寫死也可以用 env
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // 必須用 env
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});