import { client } from "@/lib/line/client";
import { handleEvent } from "@/lib/line/handleEvent";
import { userLogin } from "@/lib/line/userLogin";

export async function POST(request: Request) {
  const body = await request.json();
  const events = body.events || [];
  const text = events[0]?.message?.text;

  if(text === '登入') { // 登入系統
    for (const event of events) {
      await userLogin(client, event);
    }
  }else{ // 處理訊息
    for (const event of events) {
      await handleEvent(event);
    }
  }
  return Response.json({ ok: true });
}