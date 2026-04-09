import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 將你的 API Key 放在環境變數
});

export async function getTitleAndPrice(productText: string) {
  const prompt = `
    以下是一段行銷文案，請你從中萃取出：
    1. 標題（最能代表商品的主標題）
    2. 價格（例如 x 元、一組 x 元、或優惠價等）

    請直接用 **純 JSON** 回傳，**不要 Markdown 標記**，格式如下：

    {
      "title": "",
      "price": ""
    }

    文案如下：
    ${productText}
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",  
    messages: [{ role: "user", content: prompt }],
    temperature: 0,       
  });

  const output = response.choices[0].message.content;
  return output;
}
