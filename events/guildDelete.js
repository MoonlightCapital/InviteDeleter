

module.exports = async (client, guild) => {
  client.specialChannels.BOT_LOG.send(`:arrow_left: Removed from a server: **${client.utils.escapeMarkdown(guild.name)}** (\`${guild.id}\`) owned by ${client.utils.escapeMarkdown(guild.owner.user.tag)} (\`${guild.ownerID}\`)`)
}
