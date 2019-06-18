const {greentick, redtick, yellowtick} = require('../includes/emotes')


exports.run = async (client, message, args) => {

  if(args.length < 2)
    return message.channel.send(`${yellowtick} Please provide an user and a level`)

  const userMention = client.utils.parseMention(args.shift())
  if(!userMention)
    return message.channel.send(`${redtick} Could not parse mention from first argument`)

  const data = await client.db.getUser(userMention)

  if(!data)
    return message.channel.send(`${redtick} No data found for that user`)

  const level = parseInt(args[0])

  if(level >= message.author.data.powerlevel)
    return message.channel.send(`${redtick} You can set a powerlevel that\'s only lower than yours`)

  if(data.powerlevel >= message.author.data.powerlevel)
    return message.channel.send(`${redtick} Invalid permissions`)

  const levelTag = client.pl.getLevelTag(level)

  if(!levelTag)
    return message.channel.send(`${redtick} Invalid powerlevel`)

  data.powerlevel = level

  await client.db.updateUser(data)

  message.channel.send(`${greentick} \`${data.id}\`'s powerlevel was set to ${levelTag}`)

  client.specialChannels.BOT_LOG.send(`:helmet_with_cross: ${client.utils.escapeMarkdown(message.author.tag)} (\`${message.author.id}\`) set \`${data.id}\`'s powerlevel to **${level}**`)
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
  cooldown: 3,
}
