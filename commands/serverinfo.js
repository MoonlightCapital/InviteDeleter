const {greentick, redtick, yellowtick} = require('../includes/emotes')
const {RichEmbed} = require('discord.js')

exports.run = async (client, message, args) => {

  if(args.length < 1)
    return message.channel.send(`${yellowtick} Please provide a server ID`)

  const guild = client.guilds.get(args[0])

  if(!guild)
    return message.channel.send(`${redtick} Could not find a server with that ID`)

  const guildOwner = await client.fetchUser(guild.ownerID)

  const embed = new RichEmbed()

  .setTitle(`Information for server ${guild.name}`)
  .setThumbnail(guild.iconURL)
  .setColor(0xcc3399)

  .addField('Member count', guild.members.size)
  .addField('Owner', `${client.utils.escapeMarkdown(guildOwner.tag)} (\`${guild.ownerID}\`)`)
  .addField('Bot has ban permission', guild.me.hasPermission('BAN_MEMBERS'))

  message.channel.send(embed)
}

exports.help = {
  name: 'serverinfo',
  info: 'Shows information about a server',
  usage: '<serverid>',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: ['server'],
  minLevel: 3,
  cooldown: 3,
}
