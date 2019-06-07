const {RichEmbed} = require('discord.js')
const {redtick} = require('../includes/emotes')

exports.run = async (client, message, args) => {
  if(!args[0]) {
    const commandList = client.commands
    .filter(c => c.help.unlisted === false && c.config.minLevel <= message.author.data.powerlevel)
    .map(c => `\`${client.config.prefix}${c.help.name}\` - ${c.help.info}`)
    .join('\n')

    const embed = new RichEmbed()
      .setTitle('Listing all commands')
      .setColor(0x99cc33)
      .setDescription(commandList)

      .addField('Links', `[GitHub](https://github.com/MoonlightCapital/InviteDeleter) | [Support](https://discord.gg/hNQWVVC) | [Add me to your server](${await client.generateInvite(314436)})`)

      .setFooter(`Use ${client.config.prefix}help [command] to see detailed information about a specific command`)
    return message.channel.send(embed)
  }

  const command = client.commands.get(args[0]) || client.commands.find(c => c.config.aliases.includes(args[0]))

  if(!command || command.unlisted) return message.channel.send(`${redtick} Unknown command`)

  const embed = new RichEmbed()
    .setColor(0x33cc99)
    .addField('Description', command.help.info)
    .addField('Usage', `${client.config.prefix}${args[0]} ${command.help.usage}`)
    .addField('Minimum power level required', client.pl.getLevelTag(command.config.minLevel))
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
  cooldown: 3,
}
