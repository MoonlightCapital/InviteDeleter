

module.exports = async (client, guild) => {
  client.specialChannels.BOT_LOG.send(`:arrow_right: Added into a server: **${client.utils.escapeMarkdown(guild.name)}** (\`${guild.id}\`) owned by ${client.utils.escapeMarkdown(guild.owner.user.tag)} (\`${guild.ownerID}\`)`)

  const ownerData = await client.db.forceUser(guild.ownerID)

  if(ownerData.powerlevel < 0) {
    client.specialChannels.BOT_LOG.send(`:passport_control: ${guild.owner.user.tag} (\`${guild.ownerID}\`) is blacklisted, and tried to add me to a server they own`)
    return guild.leave().catch(console.error)
  }
}
