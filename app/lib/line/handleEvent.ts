import { handleProductMessage } from './handleProductMessage';
import { handleCustomerReply } from './handleCustomerReply';
import { getField } from '@/lib/utils/getField';

export async function handleEvent(event: any) { 
  try {
    // Bot 加入群組
    if (event.type === 'join') return;
    // 只處理文字
    if (event.type !== 'message' || event.message.type !== 'text' || !event.message.quotedMessageId) return;
    const { id: messageId, text } = event.message;
    const { userId, groupId } = event.source;
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