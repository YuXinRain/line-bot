import axios from "axios";

export async function uploadImageToNotion(imageBuffer: Buffer) {

  // 1️⃣ 建立 upload
  const upload = await axios.post(
    "https://api.notion.com/v1/file_uploads",
    {},
    {
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        "Notion-Version": "2026-03-11",
      },
    }
  );

  const uploadUrl = upload.data.upload_url;
  const uploadId = upload.data.id;

  // 2️⃣ 上傳圖片
  await axios.put(uploadUrl, imageBuffer, {
    headers: {
      "Content-Type": "image/jpeg",
    },
  });

  // 3️⃣ 取得檔案資訊
  const fileInfo = await axios.get(
    `https://api.notion.com/v1/file_uploads/${uploadId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        "Notion-Version": "2026-03-11",
      },
    }
  );

  const imageUrl = fileInfo.data.file.url;

  return imageUrl;
}
