import { handleProductMessage } from './handleProductMessage';
import { handleCustomerReply } from './handleCustomerReply';
import { getField } from '@/lib/utils/getField';
import { getGroupName } from './getGroupName';
import { pool } from '../db/db';

export async function handleEvent(event: any) { 
  try {
    // Bot 加入群組 將 Id, name 寫進資料庫
    if(event.type === 'join'){
      const groupName = await getGroupName(event.source.groupId);
      await pool.query(
        `INSERT INTO stores (id, name)
         VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name
        `,
        [event.source.groupId, groupName]
      );
      return
    }
    // 非文字訊息或沒有引用的訊息，不處理
    if (event.type !== 'message' || event.message.type !== 'text' || !event.message.quotedMessageId) return; // 

    const { id: messageId, text } = event.message;
    const { userId, groupId } = event.source;
    const result = await pool.query(
      `SELECT admin_name
       FROM stores
       WHERE id = $1
       LIMIT 1`,
      [groupId]
    );
    const adminName = result.rows[0].admin_name;

    if (!adminName){
      const result = await pool.query(
        `UPDATE admins
         SET store_id = $1
         WHERE id = $2
         RETURNING name`,
        [groupId, userId]
      );
      const adminName = result.rows[0]?.name;
      await pool.query(
        `UPDATE stores
         SET admin_name = $1
         WHERE id = $2
           AND admin_name IS NULL`,
        [adminName, groupId]
      );
    }
    const timestamp = event.timestamp;
    const quotedMessageId = event.message.quotedMessageId;
    const productName = getField(text as string, '產品名稱');
    const spec = getField(text as string , '規格');
    // 商品發布
    if (productName && userId === process.env.TARGET_USER_ID) {
      await handleProductMessage({
        messageId,
        productName,
        groupId,
        timestamp,
        quotedMessageId,
        spec: spec as string
      });
    }

    // 客人 +1
    if (!productName) {
      await handleCustomerReply({
        text,
        quotedMessageId,
        userId,
      });
    }

  } catch (err) {
    console.error('處理訊息錯誤:', err);
  }
}