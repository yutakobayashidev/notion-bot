const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const database_id = process.env.NOTION_DATABASE_ID;

module.exports = {
  data: {
    name: "inbox",
    description: "INBOXにタスクを追加します",
    options: [
      {
        type: "STRING",
        name: "タイトル",
        description: "タイトルを入力します。",
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const response = await notion.pages.create({
      parent: {
        database_id: database_id,
      },
      properties: {
        タスク名: {
          title: [
            {
              text: {
                content: `${interaction.options.getString("タイトル")}`,
              },
            },
          ],
        },
      },
    });
    const url = response["url"];
    await interaction.reply(
      `「${interaction.options.getString("タイトル")}」を作成しました\n` + url
    );
  },
};
