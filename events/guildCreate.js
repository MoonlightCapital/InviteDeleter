const {logHook} = require('../includes/logging')

module.exports = async (client, guild) => {
  logHook.send(`:arrow_right: Added into a server: **${client.utils.escapeMarkdown(guild.name)}** (\`${guild.id}\`)`)

  const ownerData = await client.db.forceUser(guild.ownerID)

  if(ownerData.powerlevel < 0) {
    logHook.send(`:passport_control: ${guild.owner.user.tag} (\`${guild.ownerID}\`) is blacklisted, and tried to add me to a server they own`)
    return guild.leave().catch(console.error)
  }
}
