const {greentick, yellowtick, redtick} = require('../includes/emotes')
const {Guild, PartialGuild, RichEmbed} = require('discord.js')

exports.run = async (client, message, args) => {

  const invite = args[0]

  try {
    const link = await client.fetchInvite(invite)

    const embed = new RichEmbed()
    .setTitle(`Information for invite code **${link.code}**`)
    .setColor(0x008080)

    .addField('Channel', `**#${client.utils.escapeMarkdown(link.channel.name)}** (\`${link.channel.id}\`)`)
    .addField('Server', `${client.utils.escapeMarkdown(link.guild.name)} (\`${link.guild.id}\`)`)

    if(link.guild instanceof Guild) {
      embed.addField('Server member count', link.guild.members.size)
      .setThumbnail(link.guild.iconURL)
    }

    message.channel.send(embed)
  } catch(e) {
    message.channel.send(`${redtick} Invite link is invalid`)
  }
}
exports.help = {
  name: 'inviteinfo',
  info: 'Provides information on an invite link',
  usage: '<invite>',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: [],
  minLevel: 0,
  cooldown: 5,
}
