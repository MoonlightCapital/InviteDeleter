const {greentick, redtick, yellowtick} = require('../includes/emotes')

exports.run = async (client, message, args) => {

  if(!args || args.size < 1) return message.channel.send(`${yellowtick} Please specify a command name`)
  const commandName = args[0]

  try {
    delete require.cache[require.resolve(`./${commandName}.js`)]
    const props = require(`./${commandName}.js`)

    client.commands.set(commandName, props)

    message.channel.send(`${greentick} Command \`${commandName}\` has been reloaded`)
  } catch (error) {
    message.channel.send(`${redtick} An error occured while reloading the command:
        \`\`\`${error.name}: ${error.message}\`\`\``)
  }

}

exports.help = {
  name: 'reload',
  info: 'Reloads a command',
  usage: '<command>',
  unlisted: true,
}

exports.config = {
  guildOnly: false,
  ownerOnly: true,
  aliases: [],
  minLevel: 10
}
