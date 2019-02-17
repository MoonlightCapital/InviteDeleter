//const pattern = /((?:https?:\/\/)?(?:www\.)?(?:discord|twitter|paypal|twitch|selly)(?:\.me|\.tv|app\.com|\.gg|\.io|\/invite)(?:\/\w*)?)/gmi
const pattern = /((?:https?:\/\/)?(?:www\.)?(?:discord|paypal|selly)(?:\.me|app\.com|\.gg|\.io|\/invite)(?:\/\w*)?)/gmi
const {logHook} = require('../includes/logging')

module.exports = async (client, member) => {

  if(pattern.test(member.user.username)) {
    if(member.user.bot) return

    if(member.bannable) member.guild.ban(member.id, {reason: 'Automatic ban: suspicious link in username', days: 7}).catch(console.error)
    client.guilds.filter(g=>g.me.hasPermission('BAN_MEMBERS')).forEach(guild => {
      guild.ban(member.id, 'Invite link as username').catch(console.error)
    })
    await client.db.forceUser(member.id)
    await client.db.updateUser({powerlevel: -2, blacklistReason: 'Automatic ban: suspicious link in username'}, member.id)
    logHook.send(`:bomb: \`${member.id}\` has been automatically gbanned for having a match in its username`)

  }
}
