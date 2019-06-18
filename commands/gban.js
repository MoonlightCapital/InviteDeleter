const {greentick, redtick, yellowtick} = require('../includes/emotes')


exports.run = async (client, message, args) => {

  if(args.length < 2)
    return message.channel.send(`${yellowtick} Please provide an user and a reason`)

  const userMention = client.utils.parseMention(args.shift())
  if(!userMention)
    return message.channel.send(`${redtick} Could not parse mention from first argument`)

  const reason = args.join(' ') + ' [M]'

  if(reason.length > 200)
    return message.channel.id(`${yellowtick} Max length for reason is 200 characters`)

  client.fetchUser(userMention).then(async user => {
    user.data = await client.db.forceUser(user.id)

    if(user.data.powerlevel >= message.author.data.powerlevel)
      return message.channel.send(`${redtick} You cannot ban that user because their powerlevel is too high`)

    const potentialGuilds = client.guilds.filter(g=>g.me.hasPermission('BAN_MEMBERS'))

    const msg = await message.channel.send(`${yellowtick} Attempting to ban \`${user.id}\` from ${potentialGuilds.size} servers, this may take a while...`)

    potentialGuilds.forEach(guild => {
      guild.ban(user.id, `User banned by a bot global moderator for reason: ${reason}`).catch(e => {
        console.error(e)
      })
    })

    user.data.powerlevel =  -2
    user.data.blacklistReason = reason

    await client.db.updateUser(user.data)

    msg.edit(`${greentick} Banned \`${user.id}\` from ${potentialGuilds.size} servers`)
    client.specialChannels.BOT_LOG.send(`:hammer_and_pick: ${client.utils.escapeMarkdown(message.author.tag)} (\`${message.author.id}\`) globally banned ${user.tag} (\`${user.id}\`) with reason: *${client.utils.escapeMarkdown(reason)}*`)
  }).catch(e => {
    message.channel.send(`${redtick} An invalid user was provided, or something went wrong`)
    console.error(e)
  })

}

exports.help = {
  name: 'gban',
  info: 'Globally bans an user',
  usage: '<user> <reason>',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: ['gnome'],
  minLevel: 4,
  cooldown: 5,
}
