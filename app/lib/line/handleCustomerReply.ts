import { pool } from '@/lib/db/db';
import { addRowToTable } from '@/lib/notion/notion';
import { fetchProfile } from '@/lib/line/fetchProfile';

export async function handleCustomerReply({
  text,
  quotedMessageId,
  userId,
}: {
  text: string;
  quotedMessageId: string;
  userId: string;
}) {
  const result = await pool.query(
    `SELECT title, notion_database_id
     FROM products
     WHERE id = $1 OR img_id = $2
     LIMIT 1`,
    [quotedMessageId, quotedMessageId]
  );

  const rows = result.rows;

  const productName = rows.length ? rows[0].title : null;
  const notionDatabaseId = rows.length ? rows[0].notion_database_id : null;

  if (!productName) return;

  const userData = await fetchProfile(userId);
  
  await addRowToTable(notionDatabaseId as string, [userData?.displayName as string, text, ""]);
}