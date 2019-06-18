module.exports = async (client) => {
  console.log('I am ready!')
  console.log(`I am logged in as ${client.user.tag}`)
  console.log(`Node version: ${process.version}`)
  console.log(`Discord.JS version: ${client.dversion}`)
  console.log('===========================')

  //client.user.setPresence({ game: { name: `${client.config.prefix}help`, type: 'WATCHING' }})
  client.user.setPresence({ game: { name: `${client.config.prefix}help | https://bit.ly/InviteDeleter`, type: 'WATCHING' }, status: 'online'})

  const specials = ['BOT_LOG', 'ERROR_LOG', 'COMMAND_LOG', 'CHANGELOG']
  client.specialChannels = {}

  specials.forEach(s => {
    const variable = process.env[`${s}_CHANNEL`]
    if(!variable) {
      console.error(`Missing env channel: ${s}`)
      process.exit(0)
    }

    const chan = client.channels.get(variable)
    if(!chan) {
      console.error(`Missing Discord channel: ${s}`)
      process.exit(0)
    }

    client.specialChannels[s] = chan
  })
}
