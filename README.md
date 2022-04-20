# notion-bot

Discord 上から Notion にタスクを追加したり期間切れタスクや未スケジューリングタスクを確認できる Discord BOT です。

## 使用方法

### 環境変数

プロジェクトのルートディレクトリに以下の内容で.env を作成します。

```bash
BOT_TOKEN='foo' # Discord BOT Token
BOT_JOIN_LOG_CHANNEL_ID='bar' # Channel ID to be notified
NOTION_API_KEY='baz' # Notion integrations Token
NOTION_DATABASE_ID='qux' # Notion Database ID
NOTION_BOOKS_DATABASE_ID='quux'
```

### 起動

ターミナルで次のコマンドを実行してください。

```bash
# install packages
$ yarn install
# start local server
$ node index.js
Bot is online and running in 0 servers!
```

## Deployment

Heroku などにデプロイすることをおすすめします。

## Inspired

https://twitter.com/Hoshiko99/status/1498271642560073728
