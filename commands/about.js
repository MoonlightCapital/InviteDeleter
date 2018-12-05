exports.run = async (client, message) => {
  const msg = `
Hi, I'm ${client.user.username}. I'm a bot that provides security and anti-spam features to Discord servers.

You can invite me to your server with this link: Invite this bot to your server: <https://discordapp.com/api/oauth2/authorize?client_id=493299837358440468&permissions=314436&scope=bot>

If you want to ask questions about how I work, please head to my support server: <https://discord.gg/hNQWVVC>
  `

  message.channel.send(msg)
}

exports.help = {
  name: 'about',
  info: 'Shows some information about the bot',
  usage: '',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: [],
  minLevel: 0,
  cooldown: 3,
}
