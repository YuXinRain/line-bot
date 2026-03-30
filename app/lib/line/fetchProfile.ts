import { client } from "@/lib/line/client";

export async function fetchProfile(userId: string) {
  try {
    const profile = await client.getProfile(userId);
    return profile;
  } catch (err) {
    console.error('取得使用者資料失敗', err);
  }
}
