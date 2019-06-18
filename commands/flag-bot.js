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

    if(!user.bot)
      return message.channel.send(`${redtick} That's not a bot`)

    user.data = await client.db.forceUser(user.id)

    if(user.data.powerlevel >= message.author.data.powerlevel)
      return message.channel.send(`${redtick} You cannot ban that user because their powerlevel is too high`)

    user.data.powerlevel = -3
    user.data.blacklistReason = reason

    await client.db.updateUser(user.data)

    message.channel.send(`${greentick} Flagged \`${user.id}\` as malicious`)
    client.specialChannels.BOT_LOG.send(`:triangular_flag_on_post: ${client.utils.escapeMarkdown(message.author.tag)} (\`${message.author.id}\`) flagged as malicious ${user.tag} (\`${user.id}\`) with reason: *${client.utils.escapeMarkdown(reason)}*`)
  }).catch(e => {
    message.channel.send(`${redtick} An invalid user was provided, or something went wrong`)
    console.error(e)
  })

}

exports.help = {
  name: 'flag-bot',
  info: 'Flags a bot as malicious',
  usage: '<user> <reason>',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: [],
  minLevel: 4,
  cooldown: 5,
}
