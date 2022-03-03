const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

module.exports = {
  data: {
    name: "post",
    description: "ページを作成します。",
    options: [
      {
        type: "STRING",
        name: "title",
        description: "タイトルを入力します。",
      },
    ],
  },
  async execute(interaction) {
    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        タスク名: {
          title: [
            {
              text: {
                content: interaction.options.getString("title"),
              },
            },
          ],
        },
      },
    });
    const url = response["url"];
    await interaction.reply({
      content:
        `「${interaction.options.getString("title")}」を作成しました\n` + url,
      ephemeral: true,
    });
  },
};
