// db.js
import mysql from 'mysql2/promise';

// 建立連線池
export const pool = mysql.createPool({
  host: 'localhost',       // MySQL 主機
  user: 'root',            // 你的帳號
  password: 'rain0911',     // 你的密碼
  database: 'line_bot',    // 你建立的資料庫名稱
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});