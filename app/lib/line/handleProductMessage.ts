import { pool } from '@/lib/db/db';
import { createPage, addTableToPage } from '@/lib/notion/notion';
import { isQuotedMessageImage } from '@/lib/line/isQuotedMessageImage';
import { getLineImage } from '@/lib/line/getLineImage';
import { uploadImage } from '@/lib/cloudinary/cloudinary';
import { getTitleAndPrice } from '../utils/getTitleAndPrice';

export async function handleProductMessage({ messageId, text, groupId, timestamp, quotedMessageId }: { messageId: string, text: string, groupId: string, timestamp: string, quotedMessageId: string }) {
  const isImage = await isQuotedMessageImage(quotedMessageId);
  if (!isImage) return;
  const result = await getTitleAndPrice(text);
  const resultJson = JSON.parse(result as string);
  if(!resultJson) return;
  
  const properties = {
    '產品名稱': { title: [{ text: { content: resultJson?.title } }] },
    '日期': { date: { start: new Date(timestamp).toISOString() } },
    '售價': { rich_text: [{ text: { content: resultJson?.price } }] }
  };
  
  const imageBuffer = await getLineImage(quotedMessageId);
  const imageUrl = await uploadImage(imageBuffer);
  // 建立 Notion Page
  const productPage = await createPage(process.env.NOTION_DB_ID as string, properties, imageUrl as string);
  if(!productPage) return;  

  // 建立此 Page 的 Notion Database
  const tableBlock = await addTableToPage(productPage.id);
  const timestampISO = new Date(Number(timestamp)).toISOString(); 
  // 寫進資料庫
  await pool.query(
    `INSERT INTO products (id, group_id, title, created_at, img_id, notion_database_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (id) DO UPDATE SET
       group_id = EXCLUDED.group_id,
       title = EXCLUDED.title,
       created_at = EXCLUDED.created_at,
       img_id = EXCLUDED.img_id,
       notion_database_id = EXCLUDED.notion_database_id
    `,
    [
      messageId,
      groupId,
      resultJson?.title,
      timestampISO,
      isImage ? quotedMessageId : null,
      tableBlock?.results[0]?.id as string
    ]
  );
}
