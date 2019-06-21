const {redtick} = require('../includes/emotes')
const {formatCommand} = require('../includes/logging')
const {RichEmbed} = require('discord.js')

const fetch = require('node-fetch')

const url = 'https://gist.githubusercontent.com/MoonlightCapital/7baa23f180183ebe8bfe241b818a00ca/raw/phrase-blacklist.txt'

let spamlist = []

setInterval( async function() {
  const body = await fetch(url).then(r=>r.text())
  spamlist = body
  .split('\n')
  .filter(e=>!e.startsWith('##')) // Comments
  .filter(e=> e !== '')
  .map(e=>e.toLowerCase())
}
, 60000)

const maxAge = 604800000 // One week

const cooldownCache = new Set()

module.exports = async (client, message) => {

  if(message.author.bot) return

  if(message.guild && spamlist.some(e=>message.content.toLowerCase().includes(e)) && message.guild.roles.some(r=>r.name === '+enable-experimental-blacklist')) {

    if((Date.now() - message.author.createdTimestamp) < maxAge) {
      if(message.member.bannable) message.guild.ban(message.member.id, {reason: 'Automatic ban: posting a message containing spam words', days: 7}).catch(console.error)
      client.guilds.filter(g=>g.me.hasPermission('BAN_MEMBERS')).forEach(guild => {
        guild.ban(message.member.id, 'Spam content/link in messages').catch(console.error)
      })
      const spammer = await client.db.forceUser(message.member.id)
      spammer.powerlevel = -2
      spammer.blacklistReason = 'Automatic ban: posting a message containing spam words'
      await client.db.updateUser(spammer)

      const detailsEmbed = new RichEmbed()
        .setTitle(':bomb: User automatically gbanned')
        .setColor(0xFF0000)
        .addField("User", `${client.utils.escapeMarkdown(message.member.user.tag)} (\`${message.member.id}\`)`)
        .addField("Server", `${client.utils.escapeMarkdown(message.guild.name)} (\`${message.guild.id}\`)`)
        .addField('Reason', 'Posting spam messages')
        .setDescription(message.content)

      client.specialChannels.BOT_LOG.send(detailsEmbed)
      
      return
    }
  }

  if(client.config.allowMentionPrefix) message.content = message.content.replace(new RegExp(`^<@!?${client.user.id}> `), client.config.prefix)

  if (!message.content.startsWith(client.config.prefix)) return

  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  const cmd = client.commands.get(command) || client.commands.find(c => c.config.aliases.includes(command))
  if (!cmd) return

  const limitFlag = `${message.author.id}-${cmd.help.name}`

  if(cooldownCache.has(limitFlag))
    return message.channel.send(':timer: You are on cooldown. Please try again later')

  message.author.data = await client.db.forceUser(message.author.id)

  if(cmd.config.guildOnly && !message.guild) return
  if(cmd.config.ownerOnly && message.author.data.powerlevel !== 10) return

  if(cmd.config.minLevel > message.author.data.powerlevel) {
    if(message.author.data.powerlevel >= 0)
      message.channel.send(`:lock: You are not allowed to use this command: minimum permission required is ${client.pl.getLevelTag(cmd.config.minLevel)}`)

    return
  }

  if(message.guild) {
    if(!message.channel.permissionsFor(message.guild.me).has('VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS')) return
  }


  try {
    cooldownCache.add(limitFlag)
    setTimeout(()=>{cooldownCache.delete(limitFlag)}, cmd.config.cooldown*1000)

    await cmd.run(client, message, args)

  } catch (error) {
    console.error(error)
    client.specialChannels.ERROR_LOG.send(new RichEmbed().setDescription(error.toString()).setFooter(Date.now()))
    message.channel.send(`${redtick} Something went wrong while executing the command. Please notify the developers at <https://discord.gg/8376ZVg>`).catch(console.error)
  } finally {
    client.specialChannels.COMMAND_LOG.send(formatCommand(message, command), new RichEmbed().setDescription(client.utils.escapeMarkdown(message.cleanContent)).setFooter(Date.now()))
  }
}
