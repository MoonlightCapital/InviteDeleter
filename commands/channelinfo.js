const {yellowtick, redtick} = require('../includes/emotes')
const {RichEmbed} = require('discord.js')

exports.run = async (client, message, args) => {

  const channel = client.channels.get(args[0])

  if(!channel)
    return message.channel.send(`${redtick} channel not found, be sure to have provided a snowflake`)

  const embed = new RichEmbed()
  .setTitle(`Information for channel ${channel.name || ''}`)
  .setColor(process.env.THEME_COLOR)

  switch(channel.type) {
    case 'text':
      embed.addField('Type', ':hash: **Text**')
      .addField('NSFW', channel.nsfw)
      .addField('Server', `${client.utils.escapeMarkdown(channel.guild.name)} (\`${channel.guild.id}\`)`)
      break
    case 'voice':
      embed.addField('Type', ':loud_sound: **Voice**')
      .addField('Server', `${client.utils.escapeMarkdown(channel.guild.name)} (\`${channel.guild.id}\`)`)
      break
    case 'category':
      embed.addField('Type', ':file_cabinet: **Category**')
      .addField('Server', `${client.utils.escapeMarkdown(channel.guild.name)} (\`${channel.guild.id}\`)`)
      break
    case 'dm':
      embed.addField('Type', ':speaking_head: **Direct Message**')
      .addField('Recipient', `${client.utils.escapeMarkdown(channel.recipient.tag)} (\`${channel.recipient.id}\`)`)
      break
  }

  embed.setFooter(`Created at ${channel.createdAt}`)

  message.channel.send(embed)
}

exports.help = {
  name: 'channelinfo',
  info: 'Shows information about a channel',
  usage: '<channel>',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: [],
  minLevel: 4,
  cooldown: 3,
}
