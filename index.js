const fs = require("fs");
const { Client, Intents, MessageEmbed } = require("discord.js");
const dotenv = require("dotenv");

dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const commands = {};
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands[command.data.name] = command;
}

client.once("ready", async () => {
  const data = [];
  for (const commandName in commands) {
    data.push(commands[commandName].data);
  }
  await client.application.commands.set(data);
  client.user.setActivity(`/help | ${client.guilds.cache.size} servers`, {
    type: "PLAYING",
  });
  console.log(
    `Bot is online and running in ${client.guilds.cache.size} servers!`
  );
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const command = commands[interaction.commandName];
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "コマンドの実行中にエラーが発生しました。",
      ephemeral: true,
    });
  }
});

client.on("guildCreate", (guild) => {
  const Embed = new MessageEmbed(guild)
    .setColor([88, 101, 242])
    .setTitle("サーバー参加通知")
    .setDescription(`${client.user.tag}が${guild.name}で追加されました。`)
    .addFields(
      {
        name: "サーバー名/サーバーID",
        value: `${guild.name} | (ID:${guild.id})`,
      },
      {
        name: "オーナー名/ownerID",
        value: `${client.users.cache.get.name} | (ID:${guild.ownerID})`,
      }
    )
    .setFooter({ text: "BOT参加通知", iconURL: client.user.avatarURL });

  client.channels.cache
    .get(process.env.BOT_JOIN_LOG_CHANNEL_ID)
    .send({ embeds: [Embed] });
});

client.login(process.env.BOT_TOKEN);
