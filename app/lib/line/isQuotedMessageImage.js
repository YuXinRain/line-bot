import axios from 'axios';

export async function isQuotedMessageImage(quotedId) {
  try {
    const res = await axios.get(
      `https://api-data.line.me/v2/bot/message/${quotedId}/content`,
      {
        headers: { Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}` },
        responseType: 'arraybuffer', // 回傳 binary
      }
    );

    // LINE API 會在 header 回傳 Content-Type
    const contentType = res.headers['content-type'];
    
    // 判斷是不是圖片
    if (contentType.startsWith('image/')) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    // 可能不是圖片或已過期
    return false;
  }
}