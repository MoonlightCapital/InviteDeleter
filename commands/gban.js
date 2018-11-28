exports.run = async (client, message, args) => {

  if(args.length < 2)
    return message.channel.send('<:yellowtick:517062281805299712> Please provide an user and a reason')

  const userMention = client.utils.parseMention(args.shift())
  if(!userMention)
    return message.channel.send('<:yellowtick:517062281805299712> Could not parse mention from first argument')

  const reason = args.join(' ') + ' [M]'

  if(reason.length > 200)
    return message.channel.id('<:yellowtick:517062281805299712> Max length for reason is 200 characters')

  client.fetchUser(userMention).then(async user => {
    user.data = await client.db.forceUser(user.id)

    if(user.data.powerlevel >= message.author.data.powerlevel)
      return message.channel.send('<:redtick:466238619997175811> You cannot ban that user because their powerlevel is too high')

    const potentialGuilds = client.guilds.filter(g=>g.me.hasPermission('BAN_MEMBERS'))

    potentialGuilds.forEach(guild => {
      guild.ban(user.id, `User banned by a bot global moderator for reason: ${reason}`)
    })

    await client.db.updateUser({powerlevel: -2, blacklistReason: reason}, user.id)

    message.channel.send(`<:greentick:466238645095890945> Banned \`${user.id}\` from ${potentialGuilds.size} servers`)
  }).catch(e => {
    message.channel.send('<:redtick:466238619997175811> An invalid user was provided, or something went wrong')
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
  aliases: [],
  minLevel: 4,
}
