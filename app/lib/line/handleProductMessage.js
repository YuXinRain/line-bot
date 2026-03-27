import pool from '../db/db';
import { createPage, addTableToPage } from '../notion/notion';
import { isQuotedMessageImage } from './isQuotedMessageImage';
import { getLineImage } from './getLineImage';
import { uploadImage } from '../cloudinary/cloudinary';

export async function handleProductMessage({ messageId, productName, groupId, timestamp, quotedMessageId, spec }) {

  const isImage = await isQuotedMessageImage(quotedMessageId);

  const properties = {
    '產品名稱': { title: [{ text: { content: productName } }] },
    '日期': { date: { start: new Date(timestamp).toISOString() } },
    '售價': { rich_text: [{ text: { content: spec } }] }
  };
    
  let imageBuffer;

  if (isImage) {
    imageBuffer = await getLineImage(quotedMessageId);
  } else {
    imageBuffer = null;
  }

  const imageUrl = await uploadImage(imageBuffer);
  // 建立 Notion Page
  const productPage = await createPage(process.env.NOTION_DB_ID, properties, imageUrl);
  if(!productPage) return;  

  // 建立此 Page 的 Notion Database
  const tableBlock = await addTableToPage(productPage.id);
  
  // 寫進資料庫
  await pool.execute(
    `INSERT INTO messages (id, group_id, title, timestamp, img_id, notion_database_id)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       id = VALUES(id),
       group_id = VALUES(group_id),
       timestamp = VALUES(timestamp),
       img_id = VALUES(img_id),
       notion_database_id = VALUES(notion_database_id)`,
    [messageId, groupId, productName, timestamp, isImage ? quotedMessageId : null, tableBlock.results[0].id]
  );
}
