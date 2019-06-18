const {greentick, yellowtick, redtick} = require('../includes/emotes')


exports.run = async (client, message, args) => {

  const guild = client.guilds.get(args[0])

  if(!guild)
    return message.channel.send(`${redtick} You provided an invalid server ID, or I'm not in that server`)

  if(guild.deleted)
    return message.channel.send(`${yellowtick} Already left that server`)

  await guild.leave()

  message.channel.send(`${greentick} Left server ${client.utils.escapeMarkdown(guild.name)} (\`${guild.id}\`)`)

  client.specialChannels.BOT_LOG.send(`:leftwards_arrow_with_hook: ${client.utils.escapeMarkdown(message.author.tag)} (\`${message.author.id}\`) removed the bot from server ${client.utils.escapeMarkdown(guild.name)} (\`${guild.id}\`)`)
}

exports.help = {
  name: 'leaveserver',
  info: 'Makes the bot leave a server',
  usage: '<serverid>',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: [],
  minLevel: 4,
  cooldown: 3,
}
