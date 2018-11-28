exports.run = async (client, message) => {
  message.channel.send('My source code can be found at http://sasg.html-5.me/board')
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
  minLevel: 0
}
