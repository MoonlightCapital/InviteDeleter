const {greentick, yellowtick, redtick} = require('../includes/emotes')

const snowflakes = {
  red: '466238619997175811',
  green: '466238645095890945'
}


exports.run = async (client, message, args) => {

  if(!message.member.hasPermission('BAN_MEMBERS'))
    return message.channel.send(`${redtick} You need to be able to ban members in order to continue this operation`)

  if(!message.guild.me.hasPermission('BAN_MEMBERS'))
    return message.channel.send(`${redtick} I need to be able to ban members in order to continue this operation`)

  if(message.author.data.points < 2)
    return message.channel.send(`${redtick} You don't have enough CP to use this command. \`2CP\` are required`)

  if(!message.channel.permissionsFor(message.guild.me).has('USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS'))
    return message.channel.send(`${redtick} Couldn't create a reaction menu`)

  const msg = await message.channel.send(`${message.author}
:warning: This will use \`2CP\` of yours.

Please react with the green tick if you want to send, and with the red one to cancel.
`)

  await msg.react(snowflakes.green)
  await msg.react(snowflakes.red)

  const reactionFilter = (r, u) => u.id === message.author.id && (r.emoji.name === 'greentick' || r.emoji.name === 'redtick')

  try {
    const collector = await msg.awaitReactions(reactionFilter, {time: 30000, max: 1, errors: ["time"]})

    if(collector.first().emoji.id === snowflakes.green) {

      const banlist = client.db._raw.users.where(u=>u.powerlevel === -2)


      await banlist.forEach(a=>message.guild.ban(a.id, a.blacklistReason))

      message.author.data.points -= 2
      client.db.updateUser(message.author.data)

      msg.edit(`${greentick} The global ban list has been synced with this server. ${banlist.length} users have been banned`)
    } else if(collector.first().emoji.id === snowflakes.red) {
      msg.edit(`${redtick} Operation aborted. Thanks for reconsidering`)
    }

  } catch(e) {
    console.error(e)
    msg.edit(`${yellowtick} Timeout: operation aborted`)
  }
}

exports.help = {
  name: 'sync-bans',
  info: 'Retroactively bans all the globally banned users found in the bot database',
  usage: '',
  unlisted: false,
}

exports.config = {
  guildOnly: true,
  ownerOnly: false,
  aliases: [],
  minLevel: 0,
  cooldown: 10,
}
