const {logHook} = require('../includes/logging')

module.exports = (client, guild) => {
  logHook.send(`:arrow_left: Removed from a server: **${client.utils.escapeMarkdown(guild.name)}** (\`${guild.id}\`) owned by ${client.utild.escapeMarkdown(guild.owner.user.tag)} (\`${guild.ownerID}\`)`)
}
