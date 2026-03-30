import { pool } from '@/lib/db/db';
import { addRowToTable } from '@/lib/notion/notion';
import { fetchProfile } from '@/lib/line/fetchProfile';
import { RowDataPacket } from 'mysql2'; // <-- 引入 RowDataPacket

export async function handleCustomerReply({
  text,
  quotedMessageId,
  userId,
}: {
  text: string;
  quotedMessageId: string;
  userId: string;
}) {
  // 明確告訴 TypeScript 回傳的 rows 是 RowDataPacket[]
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT title, notion_database_id
     FROM messages 
     WHERE id = ? OR img_id = ? 
     LIMIT 1`,
    [quotedMessageId, quotedMessageId]
  );

  // 現在 rows.length 不會再報錯
  const productName = rows.length ? rows[0].title : null;
  const notionDatabaseId = rows.length ? rows[0].notion_database_id : null;

  if (!productName) return;

  const userData = await fetchProfile(userId);
  console.log("rows from DB:", rows);
  console.log("userData from Line:", userData);
  await addRowToTable(notionDatabaseId as string, [userData?.displayName as string, text, ""]);
}