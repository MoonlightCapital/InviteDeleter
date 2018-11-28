const {RichEmbed} = require('discord.js')

exports.run = async (client, message, args) => {

  if(!args[0]) {
    const commandList = client.commands.filter(c => c.help.unlisted === false).map(c => `\`${c.help.name}\``).join(', ')

    const embed = new RichEmbed()
      .setTitle('Listing all commands')
      .setDescription(commandList)
      .setFooter(`Use ${client.config.prefix}help [command] to see detailed information about a specific command`)
    return message.channel.send(embed)
  }

  const command = client.commands.get(args[0]) || client.commands.find(c => c.config.aliases.includes(args[0]))

  if(!command || command.unlisted) return message.channel.send('Unknown command')

  const embed = new RichEmbed()
    .addField('Description', command.help.info)
    .addField('Usage', `${client.config.prefix}${args[0]} ${command.help.usage}`)
    .addField('Aliases', command.config.aliases.map(a => `\`${a}\``).join(', ') || 'None')

  message.channel.send(embed)

}

exports.help = {
  name: 'help',
  info: 'Lists all available commands, or shows information about a specific command',
  usage: '[command]',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: [],
  minLevel: 0,
}
