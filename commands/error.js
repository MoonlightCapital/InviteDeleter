exports.run = async (client, message) => {

  throw new Error('Test')

}

exports.help = {
  name: 'error',
  info: 'Throws an error',
  usage: '',
  unlisted: true,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: [],
  minLevel: 10
}
