const event = require('../event-stuff/constants')

module.exports = async (client, member) => {
  if(member.user.bot) return

  const data = await client.db.getUser(member.id)

  if(!data) return

  if(member.guild.id === event.server && data.powerlevel === 1)
    await client.db.updateUser({powerlevel: 0}, member.id)
}
