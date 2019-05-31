const {greentick, yellowtick, redtick} = require('../includes/emotes')
const {logHook} = require('../includes/logging')
const event = require('../event-stuff/constants')
const checks = require('../event-stuff/verification')

exports.run = async (client, message) => {

  if(!event.inEvent)
    return message.channel.send(`${redtick} There no event going on right now`)

  if(message.author.data.powerlevel === 1)
    return message.channel.send(`${greentick} You're already taking part in the event`)

  const msg = []
  let failed = 0

  if(checks.serverCheck(client, message.author.id)) {
    msg.push(`${greentick} You are in the bot's support server`)
  } else {
    msg.push(`${redtick} You are not in the bot's support server. You can get an invite by typing \`${client.config.prefix}about\``)
    failed++
  }

  if(checks.permissionCheck(message.member)) {
    msg.push(`${greentick} You are the owner or a moderator of this server`)
  } else {
    msg.push(`${redtick} Only server owners and moderators/administrators can apply`)
    failed++
  }

  if(checks.memberCheck(message.guild)) {
    msg.push(`${greentick} This server respects the quality standards. Good`)
  } else {
    msg.push(`${redtick} This server needs a certain amount of members in order to qualify`)
    failed++
  }

  msg.push('') // Pushing an empty string to add a space

  if(!failed) {
    msg.push(`${greentick} All good, ${message.author}, you have been given access to the event channels!`)
    client.guilds.get(event.server).members.get(message.author.id).addRole(event.role)

    logHook.send(`:tickets: ${client.utils.escapeMarkdown(message.author.tag)} (\`${message.author.id}\`) applied from server \`${message.guild.id}\``)

    message.author.data.powerlevel = 1 //this will go unused if the user is a global mod, but who cares

    if(message.author.data.powerlevel < 3)
      await client.db.updateUser(message.author.data)
  } else {
    msg.push(`${yellowtick} Some checks failed, please fix them before trying to apply again`)
  }

  message.channel.send(msg.join('\n'))
}

exports.help = {
  name: 'apply',
  info: 'Apply for the event here',
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
