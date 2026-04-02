import { client } from "@/lib/line/client";
import { fetchProfile } from "@/lib/line/fetchProfile";
import { handleEvent } from "@/lib/line/handleEvent";

export async function POST(request: Request) {
  const body = await request.json();
  const events = body.events || [];
  const text = events[0].message.text;

  if(text === '登入') { // 登入系統
    for (const event of events) {
      const userId = event.source?.userId;
      const displayName = (await fetchProfile(userId))?.displayName;
      await client.replyMessage(event.replyToken, [
        {
          type: 'text',
          text: `『${displayName}』您好 🌸，以下是您的 ID 👇\n${userId}`,
        },
      ]);
    }
  }else{ // 處理訊息
    for (const event of events) {
      await handleEvent(event);
    }
  }
  return Response.json({ ok: true });
}