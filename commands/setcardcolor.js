const pattern = /^#[A-Fa-f0-9]{6}$/gmi

exports.run = async (client, message, args) => {

  if(args.length < 2)
    return message.channel.send('<:yellowtick:517062281805299712> Please provide an user and a level')

  const userMention = client.utils.parseMention(args.shift())
  if(!userMention)
    return message.channel.send('<:yellowtick:517062281805299712> Could not parse mention from first argument')

  const data = await client.db.getUser(userMention)

  if(!data)
    return message.channel.send('<:redtick:466238619997175811> No data found for that user')

  const color = args[0]

  if(data.powerlevel >= message.author.data.powerlevel)
    return message.channel.send('<:redtick:466238619997175811> Invalid permissions')

  const colorMatch = color.match(pattern)

  if(!colorMatch)
    return message.channel.send('<:yellowtick:517062281805299712> Please provide a valid color')

  await client.db.updateUser({cardColor: color}, data.id)

  message.channel.send(`<:greentick:466238645095890945> \`${data.id}\`'s card color was set to ${color}`)
}

exports.help = {
  name: 'setcardcolor',
  info: 'Sets an user\'s card color',
  usage: '<user> <color>',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: ['scc'],
  minLevel: 3,
}
