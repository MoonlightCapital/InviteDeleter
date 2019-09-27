const {greentick, redtick} = require('../includes/emotes')


exports.run = async (client, message, args) => {

  const guild = client.guilds.get(args[0])

  if(!guild || guild.deleted)
    return message.channel.send(`${redtick} You provided an invalid server ID, or I'm not in that server`)

  const consent = guild.me.roles
  .filter(r=>r.id !== guild.id) //this is the (@)everyone role
  .some(r=>r.hasPermission('CREATE_INSTANT_INVITE', true, false))

  if(!consent)
    return message.channel.send(`${redtick} I do not have explicit permission to create invites in that server`)


  const channel = guild.channels.find(c=>c.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE') && c.type !== 'category')

  if(!channel)
    return message.channel.send(`${redtick} Couldn't create an invite in any channel`)

  try {
    const invite = await channel.createInvite({maxUses: 1})

    await message.author.send(`:link: Here's your invite link to ${client.utils.escapeMarkdown(guild.name)}: <https://discord.gg/${invite.code}>`)

    if(message.guild)
      await message.channel.send(`${greentick} Created an invite link and sent it in your DMs`)

  } catch(e) {
    if(e.code === 50007)
      message.channel.send(`${redtick} Could not DM you the invite link`)
    else if(e.code === 50013)
      message.channel.send(`${redtick} Could not create the invite due to a permissions error`)
    else {
       console.error(e)
       message.channel.send(`${redtick} Something went wrong`)
     }
  }

  client.specialChannels.BOT_LOG.send(`:link: ${client.utils.escapeMarkdown(message.author.tag)} (\`${message.author.id}\`) created an invite for server ${client.utils.escapeMarkdown(guild.name)} (\`${guild.id}\`)`)
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
