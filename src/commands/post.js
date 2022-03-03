const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

const now = new Date();
const yesterday = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() - 1
);

module.exports = {
  data: {
    name: "post",
    description: "ページを作成します。",
    options: [
      {
        type: "SUB_COMMAND",
        name: "pages",
        description: "ページを作成します。",
        options: [
          {
            type: "STRING",
            name: "title",
            description: "タイトルを入力します。",
            required: true,
          },
        ],
      },
      {
        type: "SUB_COMMAND",
        name: "query",
        description: "データベースをフィルターして検索します。",
        options: [
          {
            type: "STRING",
            name: "type",
            description:
              "期間切れタスクか未スケジューリングタスクなのかを選択します",
            required: true,
            choices: [
              { name: "期間切れタスク", value: "expired" },
              { name: "未スケジューリングタスク", value: "unschedule" },
            ],
          },
        ],
      },
    ],
  },
  async execute(interaction) {
    if (interaction.commandName === "post") {
      if (interaction.options.getSubcommand() === "pages") {
        const title = interaction.options.getString("title");
        const response = await notion.pages.create({
          parent: {
            database_id: databaseId,
          },
          properties: {
            タスク名: {
              title: [
                {
                  text: {
                    content: title,
                  },
                },
              ],
            },
          },
        });
        const url = response["url"];
        await interaction.reply({
          content: `「${title}」を作成しました\n` + url,
          ephemeral: true,
        });
      } else if (interaction.options.getSubcommand() === "query") {
        if (interaction.options.getString("type") === "expired") {
          const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
              and: [
                {
                  property: "Status",
                  select: {
                    does_not_equal: "Done",
                  },
                },
                {
                  property: "Status",
                  select: {
                    does_not_equal: "Pending",
                  },
                },
                {
                  property: "Date",
                  date: {
                    before: yesterday,
                  },
                },
              ],
            },
          });
          console.log(response);
          await interaction.reply({
            content: `期間切れタスクが${
              Object.keys(response["results"]).length
            }件見つかりました。`,
            ephemeral: true,
          });
        } else if (interaction.options.getString("type") === "unschedule") {
          const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
              and: [
                {
                  property: "Status",
                  select: {
                    does_not_equal: "Done",
                  },
                },
                {
                  property: "Date",
                  date: {
                    is_empty: true,
                  },
                },
              ],
            },
          });
          console.log(response);
          await interaction.reply({
            content: `未スケジューリングタスクが${
              Object.keys(response["results"]).length
            }件見つかりました。`,
            ephemeral: true,
          });
        }
      }
    }
  },
};
