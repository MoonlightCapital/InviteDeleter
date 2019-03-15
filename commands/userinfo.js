const {RichEmbed} = require('discord.js')
const {yellowtick, redtick} = require('../includes/emotes')


exports.run = async (client, message, args) => {

  const userMention = client.utils.parseMention(args[0] || message.author.id)
  const data = await client.db.getUser(userMention)

  if(!data)
    return message.channel.send(`${yellowtick} No data found for that user`)

  data.user = await client.fetchUser(userMention)

  if(message.author.data.powerlevel < 0 && data.user.id !== message.author.id)
    return message.channel.send(`${redtick} Couldn't show you information for that user`)


  const embed = new RichEmbed()
  .setTitle(`Information about ${data.user.tag}`)
  .setThumbnail(data.user.displayAvatarURL)
  .setColor(data.cardColor)

  .addField('Power level', client.pl.getLevelTag(data.powerlevel), true)
  .addField('Credits earned', data.points, true)

  if(data.blacklistReason && data.powerlevel < 0)
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
