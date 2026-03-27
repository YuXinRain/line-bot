import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: "2026-03-11", // 或直接省略
});
/**
 * 建立 Notion Database
 */
export async function createDatabase(parentPageId) {
  try {
    const response = await notion.databases.create({
      is_inline: true,
      parent: { 
        type: "page_id", 
        page_id: parentPageId 
      },
      title: [
        {
          type: "text",
          text: {
            content: "訂單資訊",
            link: null
        }
        }
      ],
      initial_data_source: {
        properties: {
          "消費者": {
            type: "title",
            title: {}
          },
          "數量": {
            type: "rich_text",
            rich_text: {}
          }
        }
      }
    });

    console.log("✅ Database 建立成功，ID:", response.id);
    return response;

  } catch (err) {
    console.error("❌ 建立 Notion Database 失敗:", err);
  }
}

/**
 * 建立 Notion Page（新增資料）
 */
export async function createPage(databaseId, properties, imageUrl) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties,
      ...(imageUrl && {
        cover: {
          type: "external",
          external: {
            url: imageUrl
          }
        }
      })
    });

    return response;

  } catch (err) {
    console.error(`❌ 寫入 Notion 失敗 (資料庫ID: ${databaseId})`, err);
    console.error('請確認：Integration 權限、Database ID、欄位名稱是否正確');
  }
}

export async function addTableToPage(pageId) {
  try {
    const response = await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          object: "block",
          type: "table",
          table: {
            table_width: 3,
            has_column_header: true,
            has_row_header: false,
            children: [
              {
                object: "block",
                type: "table_row",
                table_row: {
                  cells: [
                    [{ type: "text", text: { content: "消費者" } }],
                    [{ type: "text", text: { content: "數量" } }],
                    [{ type: "text", text: { content: "總額" } }]
                  ]
                }
              }
            ]
          }
        }
      ]
    });

    console.log("✅ 表格建立成功");
    return response;
  } catch (err) {
    console.error("❌ 建立表格失敗:", err);
  }
}

export async function addRowToTable(tableBlockId, rowData) {
  // rowData = ["小明", "5", "500"]
  try {
    await notion.blocks.children.append({
      block_id: tableBlockId,
      children: [
        {
          object: "block",
          type: "table_row",
          table_row: {
            cells: rowData.map(cell => [{ type: "text", text: { content: cell } }])
          }
        }
      ]
    });
    console.log("✅ 已新增列");
  } catch (err) {
    console.error("❌ 新增列失敗:", err);
  }
}