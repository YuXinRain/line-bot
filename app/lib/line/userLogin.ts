import { fetchProfile } from '@/lib/line/fetchProfile';
import { pool } from '../db/db';

export async function userLogin(client: any, event: any) {
  const userId = event?.source?.userId;
  if (!userId) return;

  const profile = await fetchProfile(userId);
  const displayName = profile?.displayName ?? '使用者';

  const message = {
    type: 'text',
    text: `『${displayName}』您好 🌸，以下是您的 ID 👇\n${userId}`,
  };
  // 寫進資料庫
  await pool.query(
    `INSERT INTO admins (id, name)
     VALUES ($1, $2)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name
    `,
    [userId, displayName]
  );

  await client.replyMessage(event.replyToken, [message]);
}