const { MessageEmbed } = require("discord.js");

const help = new MessageEmbed()
  .setColor([0, 0, 0])
  .setAuthor({
    name: "Notion",
    iconURL:
      "https://cdn.discordapp.com/attachments/912004289017286699/948886849848487996/Notion.jpeg",
  })
  .addFields(
    { name: "help", value: "`/help`", inline: true },
    { name: "POST Request", value: "`/post`", inline: true }
  )
  .addFields({
    name: "Github Repository",
    value: "https://github.com/yutakobayashidev/notion-bot",
  });

module.exports = {
  data: {
    name: "help",
    description: "BOTのヘルプを表示します。",
  },
  async execute(interaction) {
    await interaction.reply({ embeds: [help] });
  },
};
