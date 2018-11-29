const {greentick, redtick, yellowtick} = require('../includes/emotes')
const pattern = /^#[A-Fa-f0-9]{6}$/gmi

exports.run = async (client, message, args) => {

  if(args.length < 2)
    return message.channel.send(`${yellowtick} Please provide an user and a level`)

  const userMention = client.utils.parseMention(args.shift())
  if(!userMention)
    return message.channel.send(`${redtick} Could not parse mention from first argument`)

  const data = await client.db.getUser(userMention)

  if(!data)
    return message.channel.send(`${redtick} No data found for that user`)

  const color = args[0]

  if(data.powerlevel >= message.author.data.powerlevel)
    return message.channel.send(`${redtick} Invalid permissions`)

  const colorMatch = color.match(pattern)

  if(!colorMatch)
    return message.channel.send(`${yellowtick} Please provide a valid color`)

  await client.db.updateUser({cardColor: color}, data.id)

  message.channel.send(`${greentick} \`${data.id}\`'s card color was set to ${color}`)
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
