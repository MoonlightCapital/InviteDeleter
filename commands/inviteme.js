const {greentick, yellowtick, redtick} = require('../includes/emotes')
const {logHook} = require('../includes/logging')

exports.run = async (client, message, args) => {

  const guild = client.guilds.get(args[0])

  if(!guild || guild.deleted)
    return message.channel.send(`${redtick} You provided an invalid server ID, or I'm not in that server`)

  const channel = guild.channels.find(c=>c.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'))

  if(!channel)
    return message.channel.send(`${redtick} Couldn't create an invite in any channel`)

  const invite = await channel.createInvite({maxUses: 1})

  try {
    await message.author.send(`:link: Here's your invite link to ${client.utils.escapeMarkdown(guild.name)}: <https://discord.gg/${invite.code}>`)
    await message.channel.send(`${greentick} Created an invite link and sent it in your DMs`)
  } catch(e) {
    if(e.name === 'DiscordAPIError')
      message.channel.send(`${redtick} Could not DM you the invite link`)
    else console.error(e)
  }

  logHook.send(`:link: ${client.utils.escapeMarkdown(message.author.tag)} (\`${message.author.id}\`) created an invite for server ${client.utils.escapeMarkdown(guild.name)} (\`${guild.id}\`)`)
}

exports.help = {
  name: 'inviteme',
  info: 'Invites you to a server',
  usage: '<serverid>',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: [],
  minLevel: 4,
  cooldown: 5,
}
