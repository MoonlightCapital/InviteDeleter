const {redtick} = require('../includes/emotes')
const {logHook, commandHook, errorHook, formatCommand} = require('../includes/logging')
const {RichEmbed} = require('discord.js')

const cooldownCache = new Set()

module.exports = async (client, message) => {

  if(client.config.allowMentionPrefix) message.content = message.content.replace(new RegExp(`^<@!?${client.user.id}> `), client.config.prefix)

  if (!message.content.startsWith(client.config.prefix)) return
  if (message.author.bot) return

  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  const cmd = client.commands.get(command) || client.commands.find(c => c.config.aliases.includes(command))
  if (!cmd) return

  const limitFlag = `${message.author.id}-${cmd.help.name}`

  if(cooldownCache.has(limitFlag))
    return message.channel.send(':timer: You are on cooldown. Please try again later')

  message.author.data = await client.db.forceUser(message.author.id)

  if(cmd.config.guildOnly && !message.guild) return
  if(cmd.config.ownerOnly && !client.config.owners.includes(message.author.id)) return

  if(cmd.config.minLevel > message.author.data.powerlevel) {
    if(message.author.data.powerlevel >= 0)
      message.channel.send(`:lock: You are not allowed to use this command: minimum permission required is ${client.pl.getLevelTag(cmd.config.minLevel)}`)

    return
  }


  try {
    cooldownCache.add(limitFlag)
    setTimeout(()=>{cooldownCache.delete(limitFlag)}, cmd.config.cooldown*1000)

    await cmd.run(client, message, args)

  } catch (error) {
    console.error(error)
    errorHook.send(new RichEmbed().setDescription(error.toString()).setFooter(Date.now()))
    message.channel.send(`${redtick} Something went wrong while executing the command. Developers have been notified`).catch(console.error)
  } finally {
    commandHook.send(formatCommand(message, command), new RichEmbed().setDescription(client.utils.escapeMarkdown(message.cleanContent)).setFooter(Date.now()))
  }
}
