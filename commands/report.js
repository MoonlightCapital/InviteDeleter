const {greentick, yellowtick, redtick} = require('../includes/emotes')
const {logHook} = require('../includes/logging')
const fs = require('fs')
const {RichEmbed, Attachment} = require('discord.js')

const snowflakes = {
  red: '466238619997175811',
  green: '466238645095890945'
}

function generateList(messages) {
  const arr = []
  const strings = messages.map(m=>`[${m.guild.id}-${m.channel.id}-${m.author.id}] ${m.author.tag}: ${m.cleanContent}`)

  for(let i=0; i<strings.length; i++) {
    arr.push(strings[i])
  }
  return arr
}

exports.run = async (client, message, args) => {

  if(args.length < 2)
    return message.channel.send(`${redtick} Please specify an user and a reason`)

  const user = client.utils.parseMention(args.shift())
  const reason = args.join(' ')

  const messages = await message.channel.fetchMessages({limit: 100})
  const filtered = messages.filter(m=>m.author.id === user)

  if(filtered.size < 1)
    return message.channel.send(`${yellowtick} No messages from this user were sent in this channel. I need some proof to actually report`)

  if(!message.channel.permissionsFor(message.guild.me).has('USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS'))
    return message.channel.send(`${redtick} Couldn't create a reaction menu`)

  const msg = await message.channel.send(`${message.author}
:warning: This will file a report to the bot's global moderators. Keep the following in mind before sending:

This tool is to report spam problems such as dating sites, obnoxious website/server promotion and scams. A copy of the messages sent by the user will be also attached automatically.
The report command should **not** be used on trolls or people you don't like.

**ABUSING THIS COMMAND WILL GET YOU BLACKLISTED**

Please react with the green tick if you want to send, and with the red one to cancel.
`)

  await msg.react(snowflakes.green)
  await msg.react(snowflakes.red)

  const reactionFilter = (r, u) => u.id === message.author.id && (r.emoji.name === 'greentick' || r.emoji.name === 'redtick')

  try {
    const collector = await msg.awaitReactions(reactionFilter, {time: 30000, max: 1, errors: ["time"]})

    if(collector.first().emoji.id === snowflakes.green) {

      const embed = new RichEmbed()
      .setAuthor(`${message.author.tag} (${message.author.id})`)
      .setTitle('Report')
      .setDescription(reason)
      .setTimestamp(new Date())

      let filename = `./temp/reports-${user}-${message.guild.id}-${Date.now()}.txt`
      fs.writeFileSync(filename, generateList(filtered), (err) => {
        if(err) console.error(err); return message.channel.send(':x: something went wrong while creating the file. Please try again later')
      })

      client.channels.get(client.config.reportChannel).send({embed: embed, file: new Attachment(filename, 'report.txt')})
      // TODO: send action to bot log

      msg.edit(`${greentick} Your report has been filed successfully. Thank you for the help`)
    } else if(collector.first().emoji.id === snowflakes.red) {
      msg.edit(`${redtick} Operation aborted. Thanks for reconsidering`)
    }

  } catch(e) {
    msg.edit(`${yellowtick} Timeout: operation aborted`)
  }
}

exports.help = {
  name: 'report',
  info: 'Reports an user to the global moderators',
  usage: '<user> <reason>',
  unlisted: false,
}

exports.config = {
  guildOnly: true,
  ownerOnly: false,
  aliases: [],
  minLevel: 0,
  cooldown: 0,
}
