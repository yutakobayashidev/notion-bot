// Thanks https://zenn.dev/takumi/articles/1b30dddff067b6

const { Client } = require("@notionhq/client");
const axios = require("axios");

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_BOOKS_DATABASE_ID;

module.exports = {
  data: {
    name: "books",
    description: "本の検索、追加、削除を行います。",
    options: [
      {
        type: "SUB_COMMAND",
        name: "search",
        description: "Google Books APIsを利用して本を検索します。",
        options: [
          {
            type: "STRING",
            name: "keyword",
            description: "検索ワードを入力します。",
            required: true,
          },
        ],
      },
      {
        type: "SUB_COMMAND",
        name: "delete",
        description: "本のページを削除します。",
        options: [
          {
            type: "STRING",
            name: "id",
            description: "削除したいページIDを入力します。",
            required: true,
          },
        ],
      },
      {
        type: "SUB_COMMAND",
        name: "fetch",
        description: "データベースの内容を取得します。",
      },
    ],
  },
  async execute(interaction) {
    if (interaction.commandName === "books") {
      if (interaction.options.getSubcommand() === "fetch") {
        const response = await notion.databases.query({
          database_id: databaseId,
          sorts: [
            {
              property: "Date",
              direction: "descending",
            },
          ],
        });

        const fields = [];
        response.results.map((result) => {
          const title = result.properties["Name"].title[0].text.content;
          const pageId = result.id;
          const field = {
            name: `:book: ${title}`,
            value: `ページID: ${pageId}`,
          };
          fields.push(field);
        });

        // 結果を送信
        interaction.reply({
          embeds: [
            {
              title: "書籍一覧",
              description: `${
                Object.keys(response["results"]).length
              }件のデータが見つかりました。`,
              fields: fields,
              color: 4303284,
              timestamp: new Date(),
            },
          ],
        });
      } else if (interaction.options.getSubcommand() === "search") {
        const GOOLE_BOOKS_URL =
          "https://www.googleapis.com/books/v1/volumes?q=";

        const userSearchText = interaction.options.getString("keyword");
        const encodeUrl = encodeURI(`${GOOLE_BOOKS_URL}${userSearchText}`);
        try {
          // 書籍情報取得
          const googleBooksRes = await axios.get(encodeUrl);

          // google books apiからの取得データを5件分にする
          const items = googleBooksRes.data.items.slice(0, 5);

          // fields配列に必要なデータを格納
          const fields = [];
          items.map((item) => {
            const title = item.volumeInfo.title;
            const isbn = item.volumeInfo.industryIdentifiers[0].identifier;
            const field = { name: title, value: `ISBN : ${isbn}` };
            fields.push(field);
          });

          // 結果を送信
          interaction.reply({
            embeds: [
              {
                title: `「${userSearchText}」の検索結果`,
                fields: fields,
                color: 4303284,
                timestamp: new Date(),
              },
            ],
          });
        } catch (error) {
          console.log(error);
          interaction.reply("本が見つかりませんでした。");
        }
      }
    }
  },
};
