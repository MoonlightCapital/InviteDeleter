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
      return message.channel.send(`${redtick} You cannot blacklist that user because their powerlevel is too high`)

    user.data.powerlevel = -1
    user.data.blacklistReason = reason

    await client.db.updateUser(user.data)

    message.channel.send(`${greentick} ${client.utils.escapeMarkdown(user.tag)} (\`${user.id}\`) has been blacklisted`)
    
    //leave his server
    try {
        client.guilds.filter(c=>c.owner.id === user.id).forEach(g=>g.leave())
    } catch (e){
      console.error(e)
    }
    
    client.specialChannels.BOT_LOG.send(`:black_medium_small_square: ${client.utils.escapeMarkdown(message.author.tag)} (\`${message.author.id}\`) blacklisted ${user.tag} (\`${user.id}\`) with reason: *${client.utils.escapeMarkdown(reason)}*`)
  }).catch(e => {
    message.channel.send(`${redtick} An invalid user was provided, or something went wrong`)
    console.error(e)
  })

}

exports.help = {
  name: 'blacklist',
  info: 'Blacklists an user',
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
