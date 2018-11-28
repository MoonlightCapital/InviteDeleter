exports.run = async (client, message, args) => {

  if(args.length < 2)
    return message.channel.send('<:yellowtick:517062281805299712> Please provide an user and a level')

  const userMention = client.utils.parseMention(args.shift())
  if(!userMention)
    return message.channel.send('<:yellowtick:517062281805299712> Could not parse mention from first argument')

  const data = await client.db.getUser(userMention)

  if(!data)
    return message.channel.send('<:redtick:466238619997175811> No data found for that user')

  const level = parseInt(args[0])

  if(level >= message.author.data.powerlevel)
    return message.channel.send('<:redtick:466238619997175811> You can set a powerlevel that\'s only lower than yours')

  if(data.powerlevel >= message.author.data.powerlevel)
    return message.channel.send('<:redtick:466238619997175811> Invalid permissions')

  const levelTag = client.pl.getLevelTag(level)

  if(!levelTag)
    return message.channel.send('<:yellowtick:517062281805299712> Invalid powerlevel')

  await client.db.updateUser({powerlevel: level}, data.id)

  message.channel.send(`<:greentick:466238645095890945> \`${data.id}\`'s powerlevel was set to ${levelTag}`)
}

exports.help = {
  name: 'setlevel',
  info: 'Sets an user\'s powerlevel',
  usage: '<user> <level>',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: ['level'],
  minLevel: 4,
}
