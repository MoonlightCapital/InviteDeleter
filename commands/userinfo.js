const {RichEmbed} = require('discord.js')

exports.run = async (client, message, args) => {

  const userMention = client.utils.parseMention(args[0] || message.author.id)
  const data = await client.db.getUser(userMention)

  if(!data)
    return message.channel.send(':warning: No data found for that user')

  data.user = await client.fetchUser(userMention)


  const embed = new RichEmbed()
  .setTitle(`Information about ${data.user.tag}`)
  .setThumbnail(data.user.displayAvatarURL)
  .setColor(data.cardColor)

  .addField('Power level', client.pl.getLevelTag(data.powerlevel), true)
  .addField('Points earned', data.points, true)

  if(data.blacklistReason)
    embed.addField('Reason for blacklist/global ban', `\`\`\`${client.utils.escapeMarkdown(data.blacklistReason)}\`\`\``)



  message.channel.send(embed)
}

exports.help = {
  name: 'userinfo',
  info: 'Shows information about an user',
  usage: '<user>',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: ['uinfo'],
  minLevel: -1,
  cooldown: 5,
}
