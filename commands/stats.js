const {RichEmbed} = require('discord.js')
const ms = require('ms')
const {version} = require('../package')

exports.run = async (client, message) => {

  const uptime = ms(client.uptime, {long:true})
  const serverCount = client.guilds.size
  const bancount = client.db._raw.users.where(u=>u.powerlevel === -2).length

  const embed = new RichEmbed()
  .setTitle(`Statistics for ${client.user.username}`)
  .setThumbnail(client.user.displayAvatarURL)
  .setColor(process.env.THEME_COLOR)

  .addField('Uptime', uptime)
  .addField('Server count', serverCount)
  .addField('Version', version)
  .addField('Spam accounts banned so far', bancount)

  message.channel.send(embed)
}

exports.help = {
  name: 'stats',
  info: 'Shows some bot statisics',
  usage: '',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: [],
  minLevel: 0,
  cooldown: 10,
}
