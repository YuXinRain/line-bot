import { fetchProfile } from "@/lib/line/fetchProfile";
import { handleEvent } from "@/lib/line/handleEvent";

export async function POST(request: Request) {
  const body = await request.json();
  const events = body.events || [];

  for (const event of events) {
    await fetchProfile(event.source.userId);
    await handleEvent(event);
  }

  return Response.json({ ok: true });
}