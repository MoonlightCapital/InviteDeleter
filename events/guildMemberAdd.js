//const pattern = /((?:https?:\/\/)?(?:www\.)?(?:discord|twitter|paypal|twitch|selly)(?:\.me|\.tv|app\.com|\.gg|\.io|\/invite)(?:\/\w*)?)/gmi
const pattern = /((?:https?:\/\/)?(?:www\.)?(?:discord|paypal|selly)(?:\.me|app\.com|\.gg|\.io|\/invite)(?:\/\w*)?)/gmi

const {RichEmbed} = require('discord.js')

const maliciousBotEmbed = new RichEmbed()
.setTitle('Whoa there!')

.setDescription(`
Looks like you or one of your admins added a malicious bot to your server. This bot was specifically flagged as dangerous as we noticed it was a fake or a spam/advertising bot.

To protect the server, I removed the bot automatically before it could do any major damage.

Please be careful when adding bots next time! Always check that the source of the invite comes from the original bot developers.

If you believe the bot was kicked as error, [let us know](https://discord.gg/hNQWVVC).
`)

module.exports = async (client, member) => {

  const userdata = await client.db.getUser(member.id)

  if(userdata) {
    if(userdata.powerlevel === -3) {
      if(member.guild.me.hasPermission('BAN_MEMBERS')) {
        await member.ban('Automatic kick: this seems to be a malicious bot account')
        member.guild.owner.send(maliciousBotEmbed).catch(console.error)
      }
      else if(member.guild.me.hasPermission('KICK_MEMBERS')) {
        await member.kick('Automatic kick: this seems to be a malicious bot account')
        member.guild.owner.send(maliciousBotEmbed).catch(console.error)
      }
    }
  }

  if(pattern.test(member.user.username)) {
    if(member.user.bot) return

    if(member.bannable) member.guild.ban(member.id, {reason: 'Automatic ban: suspicious link in username', days: 7}).catch(console.error)
    client.guilds.filter(g=>g.me.hasPermission('BAN_MEMBERS')).forEach(guild => {
      guild.ban(member.id, 'Invite link as username').catch(console.error)
    })
    await client.db.forceUser(member.id)
    await client.db.updateUser({powerlevel: -2, blacklistReason: 'Automatic ban: suspicious link in username'}, member.id)
    
    const detailsEmbed = new RichEmbed()
      .setTitle(":bomb: User gbanned")
      .setDescription(`An user was gbanned for having a match in its username`)
      .addField("User", `${member.user.tag} [\`${member.id}\`]`)
      .addField("Server", `\`${member.guild.id}\``)
    
    client.specialChannels.BOT_LOG.send(detailsEmbed)

  }
}
