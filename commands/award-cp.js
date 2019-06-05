const {greentick, redtick, yellowtick} = require('../includes/emotes')
const {logHook} = require('../includes/logging')

exports.run = async (client, message, args) => {

  if(args.length < 2)
    return message.channel.send(`${yellowtick} Please provide an user and an amount of points`)

  const userMention = client.utils.parseMention(args.shift())
  if(!userMention)
    return message.channel.send(`${redtick} Could not parse mention from first argument`)

  const data = await client.db.getUser(userMention)

  if(!data)
    return message.channel.send(`${redtick} No data found for that user`)

  const amount = parseInt(args[0])

  if(data.powerlevel >= message.author.data.powerlevel)
    return message.channel.send(`${redtick} Invalid permissions`)


  if(Number.isNaN(amount))
    return message.channel.send(`${yellowtick} Please provide a valid number`)

  data.points += amount

  await client.db.updateUser(data)

  message.channel.send(`${greentick} \`${data.id}\` has been given ${amount} CP`)
  logHook.send(`:beginner:  ${client.utils.escapeMarkdown(message.author.tag)} (\`${message.author.id}\`) awarded \`${data.id}\` with **${amount}** CP`)
}

exports.help = {
  name: 'award-cp',
  info: 'Awards CP to an user',
  usage: '<user> <amount>',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: ['aw'],
  minLevel: 3,
  cooldown: 3,
}
