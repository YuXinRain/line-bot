import axios from 'axios';

export async function getGroupName(groupId: string) {
  const res = await axios.get(
    `https://api.line.me/v2/bot/group/${groupId}/summary`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
      },
    }
  );
  return res.data.groupName;
}
