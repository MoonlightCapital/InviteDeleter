exports.run = async (client, message) => {
  message.channel.send('My source code can be found at https://github.com/MoonlightCapital/InviteDeleter')
}

exports.help = {
  name: 'source',
  info: 'Shows a link to the bot souce code',
  usage: '',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: ['github'],
  minLevel: 0,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: [],
  minLevel: 0,
  cooldown: 3,
}
