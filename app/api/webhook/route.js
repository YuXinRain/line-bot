import { fetchProfile } from "@/lib/line/fetchProfile";
import { handleEvent } from "@/lib/line/handleEvent";

export async function POST(request) {
  const body = await request.json();
  const events = body.events || [];

  // 確保跟 Express 時一樣：每個 event 都先 fetchProfile
  for (const event of events) {
    fetchProfile(event.source.userId);
  }

  // 再處理 event
  for (const event of events) {
    handleEvent(event);
  }

  return Response.json({ ok: true });
}