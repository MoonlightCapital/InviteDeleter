const {logHook} = require('../includes/logging')

module.exports = (client, guild) => {
  logHook.send(`:arrow_right: Added into a server: **${client.utils.escapeMarkdown(guild.name)}** (\`${guild.id}\`)`)
}
