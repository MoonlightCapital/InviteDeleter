const {greentick, redtick, yellowtick} = require('../includes/emotes')
const maxAge = 259200000 // 72 hours

const snowflakes = {
  red: '466238619997175811',
  green: '466238645095890945'
}


exports.run = async (client, message, args) => {

  if(args.length < 2)
    return message.channel.send(`${yellowtick} Please provide an user and a reason`)

  const userMention = client.utils.parseMention(args.shift())
  if(!userMention)
    return message.channel.send(`${redtick} Could not parse mention from first argument`)

  const reason = args.join(' ') + ' [M]'

  if(reason.length > 200)
    return message.channel.id(`${yellowtick} Max length for reason is 200 characters`)

  client.fetchUser(userMention).then(async user => {


    if((Date.now() - user.createdTimestamp) > maxAge) {

      const prompt = await message.channel.send(`:warning: **This account is older than 72 hours, are you sure you want to ban it?**

User tag: ${client.utils.escapeMarkdown(user.tag)}
Created at: ${user.createdAt}
`)

      await prompt.react(snowflakes.green)
      await prompt.react(snowflakes.red)

      const reactionFilter = (r, u) => u.id === message.author.id && (r.emoji.name === 'greentick' || r.emoji.name === 'redtick')

      try {
        const collector = await prompt.awaitReactions(reactionFilter, {time: 30000, max: 1, errors: ["time"]})

        if(collector.first().emoji.id === snowflakes.green) {

          // Nothing to do here, proceed with the hammer

        } else if(collector.first().emoji.id === snowflakes.red) {
          return prompt.edit(`${greentick} Phew! That was close!`)
        }

      } catch(e) {
        console.error(e)
        return prompt.edit(`${yellowtick} Timeout: operation aborted`)
      }
    }

    user.data = await client.db.forceUser(user.id)

    if(user.data.powerlevel >= message.author.data.powerlevel)
      return message.channel.send(`${redtick} You cannot ban that user because their powerlevel is too high`)

    const potentialGuilds = client.guilds.filter(g=>g.me.hasPermission('BAN_MEMBERS'))

    const msg = await message.channel.send(`${yellowtick} Attempting to ban \`${user.id}\` from ${potentialGuilds.size} servers, this may take a while...`)

    potentialGuilds.forEach(guild => {
      guild.ban(user.id, `User banned by a bot global moderator for reason: ${reason}`).catch(e => {
        console.error(e)
      })
    })

    user.data.powerlevel = -2
    user.data.blacklistReason = reason

    await client.db.updateUser(user.data)

    msg.edit(`${greentick} Banned \`${user.id}\` from ${potentialGuilds.size} servers`)
    
    const detailsEmbed = new RichEmbed()
      .setTitle(':bomb: User manually gbanned')
      .setColor(0xFF0000)
      .addField("User", `${client.utils.escapeMarkdown(user.tag)} (\`${user.id}\`)`)
      .addField("Moderator", `${client.utils.escapeMarkdown(message.author.tag)} (\`${message.author.id}\`)`)
      .addField('Reason', `*${client.utils.escapeMarkdown(reason)}*`)

    client.specialChannels.BOT_LOG.send(detailsEmbed)

  }).catch(e => {
    message.channel.send(`${redtick} An invalid user was provided, or something went wrong`)
    client.specialChannels.ERROR_LOG.send(new RichEmbed().setTitle("Error in gban command").setDescription(`\`\`\`${e}\`\`\``))
    console.error(e)
  })

}

exports.help = {
  name: 'gban',
  info: 'Globally bans an user',
  usage: '<user> <reason>',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: ['gnome'],
  minLevel: 4,
  cooldown: 5,
}
