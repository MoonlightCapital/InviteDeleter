

exports.run = require('../event-stuff/purgecommand.js')

exports.help = {
  name: 'purgebans',
  info: 'Purges ban list',
  usage: '',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: ['cleanthismess'],
  minLevel: 2,
  cooldown: 10,
}
