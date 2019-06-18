const {greentick} = require('../includes/emotes')


exports.run = async (client, message) => {

  await message.channel.send(`${greentick} Shutting down...`)

  await client.specialChannels.BOT_LOG.send(`:mobile_phone_off: ${client.utils.escapeMarkdown(message.author.tag)} (\`${message.author.id}\`) shut the bot down`)

  process.exit(0)
}

exports.help = {
  name: 'shutdown',
  info: 'Shuts the bot down',
  usage: '',
  unlisted: true,
}

exports.config = {
  guildOnly: false,
  ownerOnly: true,
  aliases: ['restart', 'reboot'],
  minLevel: 10,
  cooldown: 0,
}
