import pool from '../db/db';
import { addRowToTable } from '../notion/notion';
import { fetchProfile } from './fetchProfile';

export async function handleCustomerReply({ text, quotedMessageId, userId }) {

  const [rows] = await pool.execute(
    `SELECT title, notion_database_id
     FROM messages 
     WHERE id = ? OR img_id = ? 
     LIMIT 1`,
    [quotedMessageId, quotedMessageId]
  );

  const productName = rows.length ? rows[0].title : null;
  const notionDatabaseId = rows.length ? rows[0].notion_database_id : null;

  if (!productName) return;

  const userData = await fetchProfile(userId);
  await addRowToTable(notionDatabaseId, [userData.displayName, text, ""]);
}